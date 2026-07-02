import { useCallback, useRef, useState } from "react";
import { ArrayOfObjectsInputProps, insert, setIfMissing, useClient } from "sanity";
import { Button, Card, Stack, Text } from "@sanity/ui";

function uniqueKey() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const BATCH_SIZE = 5;

export function BatchImageInput(props: ArrayOfObjectsInputProps) {
  const { onChange } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      onChange(setIfMissing([]));

      try {
        for (let i = 0; i < files.length; i += BATCH_SIZE) {
          const slice = files.slice(i, i + BATCH_SIZE);
          setStatus(`Uploading ${Math.min(i + BATCH_SIZE, files.length)} / ${files.length}…`);

          const assets = await Promise.all(
            slice.map((file) => client.assets.upload("image", file, { filename: file.name })),
          );

          const items = assets.map((asset) => ({
            _type: "image",
            _key: uniqueKey(),
            asset: { _type: "reference", _ref: asset._id },
          }));

          onChange(insert(items, "after", [-1]));
        }
      } finally {
        setStatus(null);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [client, onChange],
  );

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Card padding={3} radius={2} border tone="transparent">
        <Stack space={3}>
          <Text size={1} muted>
            Drop or select many images at once — uploaded in batches to avoid rate limits.
          </Text>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />
          <Button
            text={status ?? "Upload multiple images"}
            tone="primary"
            disabled={Boolean(status)}
            onClick={() => inputRef.current?.click()}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
