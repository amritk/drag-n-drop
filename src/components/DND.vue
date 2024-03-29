<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { computed, ref } from "vue";
import { type Hovered, type Item, dataTransferTypes } from "../libs";

const height = 50 + 8;

const props = defineProps<{
  indices: number[];
  item: Item;
  hovered: Hovered;
}>();

const emit = defineEmits<{
  hovered: [h: Hovered];
}>();

const position = ref<"top" | "middle" | "bottom">("middle");

const dragStart = (evt: DragEvent) => {
  if (!evt.dataTransfer || !(evt.target instanceof HTMLDivElement)) return;

  evt.target.classList.add("dragging");
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData(
    props.item.id + "-" + props.indices,
    props.item.id + "-" + props.indices,
  );
};

const dragOver = useThrottleFn((evt: DragEvent) => {
  let offset = -1;
  if (!evt.dataTransfer || !(evt.target instanceof HTMLDivElement)) return;

  const { sourceId, sourceIndices } = dataTransferTypes(
    evt.dataTransfer.types[0],
  );

  // Prevent hovering over itself
  if (sourceId === props.item.id) return;

  // Prevent from hovering over its own children
  const isChildOfSelf = sourceIndices.every(
    (sourceIndex, index) => sourceIndex === props.indices[index],
  );
  if (isChildOfSelf) return;

  if (evt.offsetY < 0.2 * height) {
    position.value = "top";
    offset = 0;
  } else if (evt.offsetY > 0.8 * height) {
    position.value = "bottom";
    offset = 1;
  } else {
    position.value = "middle";
  }
  emit("hovered", { id: props.item.id, offset });
}, 50);

const continerClass = computed(() => {
  let classList = "dnd";
  if (props.item.id === props.hovered?.id) {
    classList += ` dragover-${position.value}`;
  }
  return classList;
});
</script>

<template>
  <div
    :class="continerClass"
    @dragstart="dragStart"
    draggable="true"
    @dragover.prevent
  >
    <div class="inner" @dragover.prevent="dragOver">
      #{{ item.id }}. {{ item.name }}
    </div>

    <div class="dnd-child-container" v-if="item.children.length">
      <DND
        @hovered="(h: Hovered) => $emit('hovered', h)"
        :hovered="hovered"
        v-for="(child, childIndex) in item.children"
        :indices="[...indices, childIndex]"
        :item="child"
        :key="child.id"
      />
    </div>
  </div>
</template>

<style>
.dnd {
  padding: 4px;
  cursor: move;
  border-radius: 4px;
  border: 1px solid white;
  background-color: grey;
  transition-property: background;
  transition-duration: 250ms;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    height: 4px;
    width: 100%;
    transition-property: background;
    transition-duration: 250ms;
    background-color: transparent;
    top: -7px;
    left: 0;
  }

  &:after {
    content: "";
    position: absolute;
    height: 4px;
    width: 100%;
    transition-property: background;
    transition-duration: 250ms;
    background-color: transparent;
    bottom: -7px;
    left: 0;
  }

  .inner {
    padding-left: 16px;
    min-height: 50px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
}

.dragging {
  opacity: 0.2;
}

.dragover-top:before {
  background-color: blue;
}

.dragover-middle {
  background: blue;
}

.dragover-bottom:after {
  background-color: blue;
}

.dnd-child-container {
  display: flex;
  row-gap: 8px;
  flex-direction: column;
}
</style>
