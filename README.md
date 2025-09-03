# app

TO DO LIST AND PROPOSALS

Add a version route like v1 in the url

### 1. **Using `node-cron` with TypeScript**

You can use `node-cron` in your TypeScript project just like in JavaScript, but you'll need to install the TypeScript types for `node-cron`.

swagger.io -> For documenting the API.

# Clean & install (one-time)

From the **repo root** :

<pre class="overflow-visible!" data-start="5026" data-end="5352"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span># Remove per-app installs/locks (so npm can lay out a single workspace install)</span><span>
</span><span>rm</span><span> -rf nodejs-backend/node_modules react-frontend/node_modules
</span><span>rm</span><span> -f nodejs-backend/package-lock.json react-frontend/package-lock.json

</span><span># Fresh workspace install (creates one root node_modules + one root package-lock.json)</span><span>
npm install
</span></span></code></div></div></pre>

---

# Everyday commands (from root)

**Run both dev servers (parallel):**

<pre class="overflow-visible!" data-start="5432" data-end="5455"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm run dev
</span></span></code></div></div></pre>

**Run only backend dev:**

<pre class="overflow-visible!" data-start="5483" data-end="5514"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm run dev:backend
</span></span></code></div></div></pre>

**Run only frontend dev:**

<pre class="overflow-visible!" data-start="5543" data-end="5575"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm run dev:frontend
</span></span></code></div></div></pre>

**Build both:**

<pre class="overflow-visible!" data-start="5593" data-end="5618"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm run build
</span></span></code></div></div></pre>

**Start backend (prod):**

<pre class="overflow-visible!" data-start="5646" data-end="5679"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm run start:backend
</span></span></code></div></div></pre>

**Preview frontend build (Vite):**

<pre class="overflow-visible!" data-start="5716" data-end="5752"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm run preview:frontend
</span></span></code></div></div></pre>

---

# Installing packages now

- **Add to backend only:**
  <pre class="overflow-visible!" data-start="5818" data-end="5939"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm install express --workspace nodejs-backend
  npm install -D @types/express --workspace nodejs-backend
  </span></span></code></div></div></pre>
- **Add to frontend only:**
  <pre class="overflow-visible!" data-start="5971" data-end="6031"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm install axios --workspace react-frontend
  </span></span></code></div></div></pre>
- **Add shared dev tools at the root:**
  <pre class="overflow-visible!" data-start="6075" data-end="6124"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm install -D -W eslint prettier
  </span></span></code></div></div></pre>
- **Upgrade Prisma (backend) to match client:**
  <pre class="overflow-visible!" data-start="6176" data-end="6310"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm install -D prisma@latest --workspace nodejs-backend
  npm install @prisma/client@latest --workspace nodejs-backend
  </span></span></code></div></div></pre>

> `--workspace <name>` (or `-w <name>`) targets a single workspace.
>
> `-W` installs **at the root** (shared).
