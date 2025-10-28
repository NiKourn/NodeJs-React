import fs from 'fs';
import path from 'path';
import { prisma } from './src/lib/prisma';

async function main() {
  const importDir = './import';
  const completedDir = './import/completed';

  const files = fs.readdirSync(importDir).filter((f) => f.endsWith('.csv'));
  if (files.length === 0) {
    console.error('❌ No CSV file found in imports directory.');
    process.exit(1);
  }

  const importFile = files[0];
  const importPath = path.join(importDir, importFile);
  const completedPath = path.join(completedDir, importFile);

  console.log(`📦 Importing: ${importFile}`);

  const raw = fs.readFileSync(importPath, 'utf8');

  let imported = 0;
  let skipped = 0;

  // Try to extract header from first line
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) {
    console.error('❌ CSV is empty');
    process.exit(1);
  }
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim());

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    try {
      const recordArr: string[] =
        line.match(/("[^"]*"|[^,]+)/g)?.map((v) => v.replace(/^"|"$/g, '').trim()) || [];
      if (recordArr.length !== headers.length) {
        skipped++;
        console.warn(`⚠️ Skipped line ${i + 1}: column count mismatch`);
        continue;
      }
      const record: Record<string, string> = {};
      headers.forEach((h, idx) => {
        record[h] = recordArr[idx];
      });
      const language = record['language']?.trim();
      const set = record['set']?.trim();
      const key = record['key']?.trim();
      const text = record['text']?.trim();
      const createdAt = record['created']?.trim();
      const updatedAt = record['updated']?.trim();
      const deleteAt = record['delete']?.trim();

      if (!language || !set || !key || !text) {
        skipped++;
        console.warn(`⚠️ Skipped line ${i + 1}: missing required field(s)`);
        continue;
      }

      // Parse dates if present and valid, else undefined
      const parseValidDate = (dateStr?: string) => {
        if (!dateStr) return undefined;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? undefined : d;
      };
      const createdAtDate = parseValidDate(createdAt);
      const updatedAtDate = parseValidDate(updatedAt);
      const deleteDate = parseValidDate(deleteAt);

      try {
        await prisma.languages.create({
          data: {
            language,
            set,
            key,
            text,
            createdAt: createdAtDate,
            updatedAt: updatedAtDate,
            delete: deleteDate,
          },
        });
        imported++;
        console.log(`✅ Imported: ${key}`);
      } catch (dbErr: unknown) {
        skipped++;
        console.warn(
          `⚠️ Skipped line ${i + 1}: DB error: ${dbErr instanceof Error ? dbErr.message : JSON.stringify(dbErr)}`
        );
      }
    } catch (err: unknown) {
      skipped++;
      console.warn(
        `⚠️ Skipped line ${i + 1}: Parse error: ${err instanceof Error ? err.message : JSON.stringify(err)}`
      );
    }
  }

  console.log(`\n✅ Import complete. Imported: ${imported}, Skipped: ${skipped}`);

  await fs.promises.mkdir(completedDir, { recursive: true });
  await fs.promises.rename(importPath, completedPath);
  console.log(`📁 Moved original to: ${completedPath}`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('💥 Import failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
