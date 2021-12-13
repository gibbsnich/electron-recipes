
<template>
    <FullCalendar :options="calendarOptions" />
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

export default defineComponent({
    components: {
        FullCalendar
    },
    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next today gotoRecipesButton',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                customButtons: {
                    gotoRecipesButton: {
                        text: 'Rezepte',
                        click: () => {
                            this.$router.push('/recipes');
                        }
                    }
                },
                events: this.$store.state.events,
                eventClick: this.handleEventClick,
                /* you can update a remote database when these fire:
                eventAdd:
                eventChange:
                eventRemove:
                */
                editable: true,
                selectable: true
            },
        }
    },
    methods: {
        async handleEventClick(info) {
            await openModal(SelectRecipeModal, {evt: info.event});
        }
    }
});
</script>
