<template>
    <div class='modal'>
        <select v-model="selectedChoice">
            <option>Rezept wählen..</option>
            <option v-for="choice in this.$store.state.recipes" :value="choice.id" v-bind:key="choice.id">
                {{ choice.name }}
            </option>
        </select>
        <button @click="close">OK</button>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { closeModal } from 'jenesius-vue-modal';

export default defineComponent({
    /*
    setup() {
        
    },*/
    props: {
        evt: Object,
    },
    data() {
        return {
            selectedChoice: null,
        }
    },
    methods: {
        selectId(e) {
            this.selectedChoice = e.id
        },
        close() {
            closeModal()
            this.evt.recipeId = this.selectedChoice;
            this.$store.commit('setEvent', this.evt);
        }
    }
})
</script>
