
<template>
    <FullCalendar :options="{...calendarOptions, events: this.$store.state.events}"  />
</template>

<script>
import { defineComponent } from 'vue';
import '@fullcalendar/core/vdom'; // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { openModal } from 'jenesius-vue-modal';
import SelectRecipeModal from './SelectRecipeModal.vue';
import { generatePDF } from '../util/generatePDF.js';

export default defineComponent({
    components: {
        FullCalendar
    },
    data() {
        return {
            currentSelection: null,
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next today gotoRecipesButton generatePDFButton',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                customButtons: {
                    gotoRecipesButton: {
                        text: 'Rezepte',
                        click: () => {
                            this.$router.push('/recipes');
                        }
                    },
                    generatePDFButton: {
                        text: 'PDF erzeugen',
                        click: () => {
                            if (this.currentSelection) {
                                generatePDF(this.currentSelection, this.$store);
                            }
                        }
                    }
                },
                eventClick: this.handleEventClick,
                editable: true,
                selectable: true,
                select: this.handleSelect,
            },
        }
    },
    methods: {
        async handleEventClick(info) {
            await openModal(SelectRecipeModal, {evt: info.event});
        },
        handleSelect(info) {
            this.currentSelection = {start: info.start, end: info.end};
        },
    }
});
</script>
