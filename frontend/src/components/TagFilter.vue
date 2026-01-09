<template>
  <aside class="panel">
    <div class="panelHeader">
      <div>
        <div class="panelTitle">Topics</div>
        <div class="panelSub">Filter your feed by tag</div>
      </div>
      <button class="mini" @click="$emit('reload')">Reload</button>
    </div>

    <div v-if="loading" class="hint">Loading tags…</div>
    <div v-else-if="error" class="error">Failed to load tags: {{ error }}</div>

    <div v-else class="tags">
      <button
        class="tag"
        :class="{ active: selected === null }"
        @click="$emit('select', null)"
      >
        All
      </button>

      <button
        v-for="t in tags"
        :key="t.id"
        class="tag"
        :class="{ active: selected === t.name }"
        @click="$emit('select', t.name)"
        :title="t.description"
      >
        {{ t.name }}
      </button>
    </div>

    <div class="footer">
      Selected: <strong>{{ selected ?? "All" }}</strong>
    </div>
  </aside>
</template>

<script>
export default {
  name: "TagFilter",
  props: {
    tags: { type: Array, required: true },
    selected: { type: [String, null], default: null },
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
  },
};
</script>

<style scoped>
.panel {
  border: 1px solid #2a2f3a;
  border-radius: 16px;
  padding: 14px;
  background: rgba(255,255,255,0.03);
  position: sticky;
  top: 14px;
}
.panelHeader { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
.panelTitle { font-weight: 800; }
.panelSub { font-size: 12px; color: #a9b1c3; margin-top: 2px; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.tag {
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid #3a4354;
  background: rgba(255,255,255,0.02);
  color: inherit;
  cursor: pointer;
  font-size: 12px;
}
.tag:hover { background: rgba(255,255,255,0.06); }
.tag.active { border-color: #cfd6e6; background: rgba(255,255,255,0.08); }
.mini {
  padding: 7px 10px;
  border-radius: 10px;
  border: 1px solid #3a4354;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  color: inherit;
  font-size: 12px;
}
.hint { margin-top: 10px; color: #a9b1c3; font-size: 12px; }
.error { margin-top: 10px; color: #ff6b6b; font-size: 12px; }
.footer { margin-top: 14px; font-size: 12px; color: #a9b1c3; }
</style>
