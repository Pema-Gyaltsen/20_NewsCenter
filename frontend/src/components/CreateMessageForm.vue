<template>
  <section class="panel">
    <div class="panelHeader">
      <div>
        <div class="panelTitle">Publish</div>
        <div class="panelSub">Create a new announcement</div>
      </div>
      <button class="mini" @click="fillDemoAuthor">Use demo author</button>
    </div>

    <form class="form" @submit.prevent="submit">
      <label class="label">
        Author ID (UUID)
        <input class="input" v-model.trim="form.authorId" placeholder="e.g. b35e..." />
      </label>

      <label class="label">
        Title
        <input class="input" v-model.trim="form.title" placeholder="Short headline…" />
      </label>

      <label class="label">
        Body
        <textarea class="input textarea" v-model.trim="form.body" placeholder="Write the message…"></textarea>
      </label>

      <div class="row">
        <button class="btnPrimary" type="submit" :disabled="loading">
          {{ loading ? "Publishing…" : "Publish" }}
        </button>

        <button class="btn" type="button" @click="reset" :disabled="loading">
          Clear
        </button>
      </div>

      <div v-if="error" class="error">Create error: {{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>

      <div class="hint">
        Note: authorId must be a real UUID. “uuid-of-user” will fail.
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: "CreateMessageForm",
  props: {
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
    success: { type: String, default: null },
  },
  emits: ["submit"],
  data() {
    return {
      form: {
        authorId: "",
        title: "",
        body: "",
      },
    };
  },
  methods: {
    fillDemoAuthor() {
      this.form.authorId = "b35e7903-6975-4748-80af-ec2614f0b179";
    },
    reset() {
      this.form.title = "";
      this.form.body = "";
      // keep authorId (nice UX)
    },
    submit() {
      this.$emit("submit", { ...this.form });
    },
  },
};
</script>

<style scoped>
.panel {
  border: 1px solid #2a2f3a;
  border-radius: 16px;
  padding: 14px;
  background: rgba(255,255,255,0.03);
}
.panelHeader { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
.panelTitle { font-weight: 800; }
.panelSub { font-size: 12px; color: #a9b1c3; margin-top: 2px; }
.form { display: grid; gap: 10px; margin-top: 12px; }
.label { display: grid; gap: 6px; font-size: 12px; color: #a9b1c3; }
.input {
  border: 1px solid #3a4354;
  border-radius: 12px;
  padding: 10px 10px;
  background: rgba(0,0,0,0.25);
  color: #e9eefc;
}
.textarea { min-height: 90px; resize: vertical; }
.row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
.btnPrimary {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #4b5a78;
  background: rgba(120,160,255,0.18);
  color: inherit;
  cursor: pointer;
  font-weight: 700;
}
.btnPrimary:hover { background: rgba(120,160,255,0.25); }
.btn {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #3a4354;
  background: rgba(255,255,255,0.05);
  color: inherit;
  cursor: pointer;
}
.btn:hover { background: rgba(255,255,255,0.08); }
.mini {
  padding: 7px 10px;
  border-radius: 10px;
  border: 1px solid #3a4354;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  color: inherit;
  font-size: 12px;
}
.error { color: #ff6b6b; font-size: 12px; margin-top: 4px; }
.success { color: #2ecc71; font-size: 12px; margin-top: 4px; }
.hint { color: #a9b1c3; font-size: 12px; margin-top: 4px; }
</style>
