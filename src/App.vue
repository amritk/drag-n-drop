<script setup lang="ts">
import { ref } from "vue";
import DND, { type Hovered } from "./components/DND.vue";

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

const hovered = ref<Hovered>(null);

const onDrop = (ev: DragEvent) => {
  ev.preventDefault();
  if (!hovered.value || !ev.dataTransfer?.types?.[0]) return;

  const sourceIndices = ev.dataTransfer.types[0].split(",");
  console.log(hovered.value.id);
  console.log(sourceIndices);
  console.log(hovered.value.indices);
  console.log(hovered.value.offset);
  hovered.value = null;
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
      @hovered="(h: Hovered) => (hovered = h)"
      :hovered="hovered"
      v-for="(item, index) in items"
      :item="item"
      :key="item.id"
      :indices="[index]"
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
