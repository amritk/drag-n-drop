/**
 * Extract sourceId and indices from dataTransferTypes
 */
export const dataTransferTypes = (input: string) => {
  const [sourceIdStr, sourceIndicesStr] = input.split("-");
  const sourceId = parseInt(sourceIdStr);
  const sourceIndices = sourceIndicesStr
    .split(",")
    .map((index) => parseInt(index));

  return { sourceId, sourceIndices };
};

export type Item = {
  id: number;
  name: string;
  children: Item[];
};

export type Hovered = {
  id: number;
  offset: number;
} | null;
