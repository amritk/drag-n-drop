<script setup lang="ts">
import { ref } from "vue";
import DND from "./components/DND.vue";

const items = ref([
  {
    id: 1,
    name: "Rangers",
    children: [
      {
        id: 2,
        name: "Stars",
        children: [{ id: 3, name: "Bruins", children: [] }],
      },
      { id: 4, name: "Canucks", children: [] },
      { id: 5, name: "Panthers", children: [] },
      { id: 6, name: "Avalanche", children: [] },
      { id: 7, name: "Hurricanes", children: [] },
    ],
  },
  { id: 8, name: "Jets", children: [] },
  { id: 9, name: "Oilers", children: [] },
  { id: 10, name: "Predators", children: [] },
  { id: 11, name: "Maple Leafs", children: [] },
  { id: 12, name: "Kings", children: [] },
]);

const hoveredId = ref<number | null>(null);

const onDrop = (ev: DragEvent) => {
  ev.preventDefault();
  console.log("dropped", ev);
  console.log(hoveredId.value);
  hoveredId.value = null;
};
</script>

<template>
  <div
    class="dnd-container"
    @dragover.prevent
    @dragenter.prevent
    @drop="onDrop"
  >
    <DND
      @hovered="(id: number) => (hoveredId = id)"
      :hoveredId="hoveredId"
      v-for="(item, index) in items"
      :item="item"
      :key="item.id"
      :index="index"
    />
  </div>
</template>

<style scoped>
.dnd-container {
  min-height: 100px;
  width: 200px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  background: white;
  padding: 16px;
  border-radius: 4px;
  user-select: none;
}
</style>
