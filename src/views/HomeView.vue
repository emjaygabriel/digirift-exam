<template>
  <ToDoList />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import ToDoList from '../components/ToDoList.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    ToDoList,
  },
});
</script>
