<template>
  <ToDoListVuetify />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import ToDoListVuetify from '../components/ToDoListVuetify.vue';

export default defineComponent({
  name: 'ToDoListVuetifyVersion',

  components: {
    ToDoListVuetify,
  },
});
</script>
