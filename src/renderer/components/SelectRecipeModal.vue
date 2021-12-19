<template>
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Rezeptauswahl</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeNoSave"></button>
      </div>
      <div class="modal-body">
        <p>Rezept auswählen:</p>
        <p>
            <select class="form-select" aria-label="Rezeptauswahl" v-model="this.selectedChoice">
                <option value="-1">Rezept wählen..</option>
                <option v-for="choice in this.$store.state.recipes" :value="choice.id" v-bind:key="choice.id">
                    {{ choice.name }}
                </option>
            </select>
        </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="close">Speichern</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { defineComponent } from 'vue';
import { recurEventToEvent } from '../util/event';

export default defineComponent({
    name: 'SelectRecipeModal',
    props: {
        event: Object,
    },
    data() {
        return {
            newSelectedChoice: null,
        }
    },
    computed: {
        selectedChoice: {
            get() {
                if (this.event) {
                    if (this.event.extendedProps.recur) {
                        const { eventStart } = recurEventToEvent(this.event);
                        const selEvent = this.$store.state.events.find((evt) => evt.start === eventStart);
                        if (selEvent) {
                            return selEvent.extendedProps.recipeId;
                        }
                    } else {
                        return this.event.extendedProps.recipeId;
                    }
                }
                return null;
            },
            set(v) {
                this.newSelectedChoice = v;
            }
        }
    },
    methods: {
        // selectId(e) {
        //     this.selectedChoice = e.id
        // },
        close() {
            this.$emit('close', this.newSelectedChoice === -1 ? null : this.newSelectedChoice);
        },
        closeNoSave() {
            this.$emit('close', null);
        },
    }
})
</script>