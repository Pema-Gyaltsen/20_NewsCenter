<template>
  <aside class="panel">
    <div class="panelHeader">
      <div>
        <div class="panelTitle">Themen</div>
        <div class="panelSub">Filtere & Abonniere Tags</div>
      </div>
      <button class="mini" @click="refreshData">Reload</button>
    </div>

    <div v-if="loading" class="hint">Lade Tags…</div>
    <div v-else-if="error" class="error">Fehler: {{ error }}</div>

    <div v-else class="tag-list">
      
      <div 
        class="tag-row"
        :class="{ active: selected === null }"
        @click="$emit('select', null)"
      >
        <span class="tag-name">Alle Nachrichten</span>
      </div>

      <div 
        v-for="t in tags" 
        :key="t.id" 
        class="tag-row"
        :class="{ active: selected === t.name }"
        @click="$emit('select', t.name)"
      >
        <span class="tag-name"># {{ t.name }}</span>
        
        <button 
          class="star-btn"
          :class="{ subscribed: isSubscribed(t.id) }"
          @click.stop="toggleSubscription(t)"
          title="Abonnieren"
        >
          <span v-if="isSubscribed(t.id)">★</span>
          <span v-else>☆</span>
        </button>
      </div>
    </div>

    <div class="footer">
      Filter: <strong>{{ selected ?? "Alle" }}</strong>
    </div>
  </aside>
</template>

<script>
// Wir importieren die Service-Funktionen
import { getSubscriptions, subscribe, unsubscribe } from '../services/subscriptionService';

export default {
  name: "TagFilter",
  props: {
    tags: { type: Array, required: true },
    selected: { type: [String, null], default: null },
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
  },
  emits: ["select", "reload"],
  
  data() {
    return {
      mySubscriptions: [] // Liste der IDs, die der User abonniert hat
    };
  },

  async mounted() {
    await this.loadSubscriptions();
  },

  methods: {
    async loadSubscriptions() {
      try {
        const subs = await getSubscriptions();
        // Wir speichern nur die IDs der Tags, das reicht für den Check
        this.mySubscriptions = subs.map(s => s.id); 
      } catch (e) {
        console.error("Konnte Abos nicht laden", e);
      }
    },

    isSubscribed(tagId) {
      return this.mySubscriptions.includes(tagId);
    },

    async toggleSubscription(tag) {
      const id = tag.id;

      // 1. Optimistisches Update (Sofort anzeigen, bevor Server antwortet)
      if (this.isSubscribed(id)) {
        // Entfernen
        this.mySubscriptions = this.mySubscriptions.filter(subId => subId !== id);
        try {
          await unsubscribe(id);
        } catch (e) {
          // Falls Fehler: Rückgängig machen
          this.mySubscriptions.push(id);
          console.error(e);
        }
      } else {
        // Hinzufügen
        this.mySubscriptions.push(id);
        try {
          await subscribe(id);
        } catch (e) {
          // Falls Fehler: Rückgängig machen
          this.mySubscriptions = this.mySubscriptions.filter(subId => subId !== id);
          console.error(e);
        }
      }
    },

    refreshData() {
      this.$emit('reload'); // Lädt Tags neu
      this.loadSubscriptions(); // Lädt Abos neu
    }
  }
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
.panelHeader { display: flex; justify-content: space-between; align-items: start; gap: 12px; margin-bottom: 12px; }
.panelTitle { font-weight: 800; }
.panelSub { font-size: 12px; color: #a9b1c3; margin-top: 2px; }

/* Liste statt Buttons */
.tag-list { display: flex; flex-direction: column; gap: 4px; }

.tag-row {
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #a9b1c3;
  transition: all 0.2s;
  border: 1px solid transparent; /* Platzhalter damit es nicht springt */
}

.tag-row:hover {
  background: rgba(255,255,255,0.06);
  color: #e9eefc;
}

/* Wenn ausgewählt (Filter aktiv) */
.tag-row.active {
  background: rgba(120, 160, 255, 0.1);
  border-color: rgba(120, 160, 255, 0.3);
  color: #fff;
}

.tag-name { font-size: 13px; font-weight: 500; }

/* Der Stern Button */
.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #4a5568; /* Grau wenn inaktiv */
  line-height: 1;
  padding: 4px;
  border-radius: 4px;
  transition: transform 0.2s, color 0.2s;
}

.star-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: scale(1.1);
}

.star-btn.subscribed {
  color: #f1c40f; /* Gold für abonniert */
}

.mini {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #3a4354;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  color: inherit;
  font-size: 11px;
}
.mini:hover { background: rgba(255,255,255,0.1); }

.hint { margin-top: 10px; color: #a9b1c3; font-size: 12px; }
.error { margin-top: 10px; color: #ff6b6b; font-size: 12px; }
.footer { margin-top: 14px; font-size: 12px; color: #a9b1c3; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;}
</style>