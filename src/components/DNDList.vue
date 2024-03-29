<script setup lang="ts">
import { ref } from "vue";
import DND from "./DND.vue";
import { dataTransferTypes, type Item, type Hovered } from "../libs";

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

/**
 * Scroll through the children recursively and remove the item
 * If an item and offset are provided then it adds to the array
 * or children, otherwise it will "pop" the item
 *
 * This can definitely be improved for perf
 */
const traverseArray = (
  arr: Item[],
  id: number,
  itemToAdd?: Item,
  offset?: number,
): Item | null => {
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];

    if (item.id === id) {
      // Add item
      if (itemToAdd) {
        if (offset === -1) item.children.push(itemToAdd);
        else arr.splice(index + (offset ?? 0), 0, itemToAdd);

        return itemToAdd;
      }
      // Remove item
      else {
        const [removedItem] = arr.splice(index, 1);
        return removedItem;
      }
    } else if (item.children.length) {
      const returnedItem = traverseArray(item.children, id, itemToAdd, offset);
      if (returnedItem) return returnedItem;
    }
  }

  return null;
};

const onDrop = (ev: DragEvent) => {
  ev.preventDefault();
  document
    .querySelectorAll("div.dragging")
    .forEach((el) => el.classList.remove("dragging"));

  if (!hovered.value || !ev.dataTransfer?.types?.[0]) return;

  const { sourceId } = dataTransferTypes(ev.dataTransfer.types[0]);
  const targetId = hovered.value.id;
  const offset = hovered.value.offset;

  // Remove hover
  hovered.value = null;

  if (sourceId === targetId) return;

  // Grab and remove source
  const removedItem = traverseArray(items.value, sourceId);
  if (removedItem) traverseArray(items.value, targetId, removedItem, offset);
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
