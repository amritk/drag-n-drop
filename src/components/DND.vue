<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { computed, ref } from "vue";

type Item = {
  id: number;
  name: string;
  children: Item[];
};

const height = 50 + 8;
const props = defineProps<{
  index: number;
  item: Item;
  hoveredId: number | null;
}>();
const emit = defineEmits<{
  hovered: [id: number];
}>();

const position = ref<"top" | "middle" | "bottom">("middle");

const dragStart = (ev) => {
  ev.target.classList.add("dragging");
  ev.dataTransfer.dropEffect = "move";
  ev.dataTransfer.effectAllowed = "move";
  ev.dataTransfer.setData(props.item.id, props.item.id);
};

const dragOver = useThrottleFn((ev) => {
  console.log("====== ", props.item.name);
  console.log(ev.offsetY);

  if (ev.offsetY < 0.2 * height) {
    position.value = "top";
    emit("hovered", props.item.id);
  } else if (ev.offsetY > 0.8 * height) {
    position.value = "bottom";
    emit("hovered", props.item.id);
  } else {
    position.value = "middle";
    emit("hovered", props.item.id);
  }
}, 50);

const continerClass = computed(() => {
  let classList = "dnd";
  if (props.item.id === props.hoveredId) {
    classList += ` dragover-${position.value}`;
  }
  return classList;
});
</script>

<template>
  <div :class="continerClass">
    <div
      class="inner"
      @dragover="dragOver"
      @dragstart="dragStart"
      draggable="true"
      @dragover.prevent
    >
      #{{ item.id }}. {{ item.name }}
    </div>

    <div class="dnd-child-container" v-if="item.children.length">
      <DND
        @hovered="(id: number) => $emit('hovered', id)"
        :hoveredId="hoveredId"
        v-for="(child, childIndex) in item.children"
        :index="childIndex"
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
