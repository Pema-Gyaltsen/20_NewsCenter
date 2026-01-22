<template>
  <div class="page">
    <AppHeader @refresh="refreshAll" />

    <div class="layout">
      <TagFilter
        :tags="tags"
        :selected="selectedTag"
        :loading="tagsLoading"
        :error="tagsError"
        @select="onSelectTag"
        @reload="loadTags"
      />

      <main class="main">
        <CreateMessageForm
          :loading="createLoading"
          :error="createError"
          :success="createSuccess"
          @submit="onCreateMessage"
        />

        <MessageList
          :messages="filteredMessages"
          :loading="messagesLoading"
          :error="messagesError"
          :selectedTag="selectedTag"
          @reload="loadMessages"
        />
      </main>
    </div>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import TagFilter from "../components/TagFilter.vue";
import MessageList from "../components/MessageList.vue";
import CreateMessageForm from "../components/CreateMessageForm.vue";

import { getTags } from "../services/tagsService";
import { getMessages, createMessage } from "../services/messagesService";

export default {
  name: "HomeView",
  components: { AppHeader, TagFilter, MessageList, CreateMessageForm },

  data() {
    return {
      tags: [],
      tagsLoading: true,
      tagsError: null,

      messages: [],
      messagesLoading: true,
      messagesError: null,

      selectedTag: null,

      createLoading: false,
      createError: null,
      createSuccess: null,
    };
  },

  computed: {
    // IMPORTANT: Your /messages currently has no tag field.
    // So this is a "UI-ready" placeholder:
    // - If later your backend adds message.tags or tagName, you can filter properly.
    // - For now, selectedTag is shown in UI but doesn't filter REST list.
    filteredMessages() {
      return this.messages;
    },
  },

  async mounted() {
    await Promise.all([this.loadTags(), this.loadMessages()]);
  },

  methods: {
    async refreshAll() {
      await Promise.all([this.loadTags(), this.loadMessages()]);
    },

    onSelectTag(tagName) {
      this.selectedTag = tagName;
      // When your backend adds tags to messages, you can filter here.
    },

    async loadTags() {
      this.tagsLoading = true;
      this.tagsError = null;
      try {
        this.tags = await getTags();
      } catch (e) {
        this.tagsError = e?.message || String(e);
      } finally {
        this.tagsLoading = false;
      }
    },

    async loadMessages() {
      this.messagesLoading = true;
      this.messagesError = null;
      try {
        this.messages = await getMessages();
      } catch (e) {
        this.messagesError = e?.message || String(e);
      } finally {
        this.messagesLoading = false;
      }
    },

    async onCreateMessage(payload) {
      this.createLoading = true;
      this.createError = null;
      this.createSuccess = null;

      try {
        if (!payload.title || !payload.body) {
          throw new Error("Please fill title, and body.");
        }

        await createMessage(payload);

        this.createSuccess = "Published successfully!";
        await this.loadMessages();
      } catch (e) {
        this.createError = e?.response?.data?.details || e?.message || String(e);
      } finally {
        this.createLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.page { display: grid; gap: 14px; }
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 14px;
  align-items: start;
}
.main { display: grid; gap: 14px; }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
}
</style>
