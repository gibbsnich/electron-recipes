
<template>
    <FullCalendar :options="{...calendarOptions, events: this.$store.state.events}"  />
</template>

<script>
import { defineComponent } from 'vue';
import '@fullcalendar/core/vdom'; // solves problem with Vite
import deLocale from '@fullcalendar/core/locales/de';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { openModal } from 'jenesius-vue-modal';
import SelectRecipeModal from './SelectRecipeModal.vue';
import RandomIngredientsModal from './RandomIngredientsModal.vue';
import { dateToString } from '../util/date.js';
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
                locale: deLocale,
                //slotDuration: "02:00:00",
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next today gotoRecipesButton generatePDFButton',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
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
                dateClick: this.handleDateClick,
            },
        }
    },
    methods: {
        async handleEventClick(info) {
            if (info.event.extendedProps.extra) {
                await openModal(RandomIngredientsModal, {date: dateToString(info.event.start)});
            } else {
                await openModal(SelectRecipeModal, {event: info.event});
            }
        },
        handleSelect(info) {
            this.currentSelection = {start: info.start, end: info.end};
        },
        async handleDateClick(info) {
            await openModal(RandomIngredientsModal, {date: dateToString(info.date)});
        }
    }
});
</script>
