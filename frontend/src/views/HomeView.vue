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
          :availableTags="tags"
          @submit="onCreateMessage"
        />

        <MessageList
          :messages="messages"
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

// Wir brauchen direkten API Zugriff für die komplexeren Anfragen
import api from "../services/api"; 
import { getTags } from "../services/tagsService";

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

  // "computed: { filteredMessages ... }" IST GELÖSCHT 
  // Das Backend filtert jetzt für uns!

  async mounted() {
    await Promise.all([this.loadTags(), this.loadMessages()]);
  },

  methods: {
    async refreshAll() {
      await Promise.all([this.loadTags(), this.loadMessages()]);
    },

    // NEU: Wenn ein Tag geklickt wird, laden wir die Nachrichten neu
    onSelectTag(tagName) {
      this.selectedTag = tagName;
      this.loadMessages(); // <--- Trigger Backend Request
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

    // NEU: Filter-Logik im Backend Aufruf
    async loadMessages() {
      this.messagesLoading = true;
      this.messagesError = null;
      try {
        let url = '/messages';
        
        // Wenn ein Tag ausgewählt ist, hängen wir ?tag=IT an die URL
        if (this.selectedTag) {
          url += `?tag=${encodeURIComponent(this.selectedTag)}`;
        }

        const response = await api.get(url);
        this.messages = response.data;

      } catch (e) {
        this.messagesError = e?.message || String(e);
      } finally {
        this.messagesLoading = false;
      }
    },

    // NEU: Der 2-Schritte-Prozess beim Erstellen
    async onCreateMessage(payload) {
      this.createLoading = true;
      this.createError = null;
      this.createSuccess = null;

      try {
        // Validierung
        if (!payload.title || !payload.body || !payload.tagId) {
          throw new Error("Bitte Titel, Text und ein Thema wählen.");
        }

        // SCHRITT 1: Nachricht erstellen
        const msgResponse = await api.post('/messages', {
          title: payload.title,
          body: payload.body
        });
        
        const newMessageId = msgResponse.data.id;

        // SCHRITT 2: Tag verknüpfen
        await api.post(`/messages/${newMessageId}/tags`, {
          tagId: payload.tagId
        });

        this.createSuccess = "Nachricht erfolgreich veröffentlicht!";
        
        // Feed neu laden, damit die neue Nachricht oben erscheint
        await this.loadMessages();

      } catch (e) {
        this.createError = e?.response?.data?.error || e?.message || String(e);
      } finally {
        this.createLoading = false;
        // Erfolgsmeldung nach 3 Sekunden ausblenden
        if (this.createSuccess) {
          setTimeout(() => (this.createSuccess = null), 3000);
        }
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