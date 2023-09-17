import {
  Box,
  Group,
  Image,
  Text,
  useMantineTheme,
  rem,
  SimpleGrid,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEffect, useState } from "react";

// const IMAGE_MIME_TYPE = ["image/jpg"];

type ImgDropzoneType = {
  onFileSave: (files: FileWithPath[]) => void;
};
const ImgDropzone = ({ onFileSave, ...props }: ImgDropzoneType) => {
  const theme = useMantineTheme();
  const [filesState, setFiles] = useState<FileWithPath[]>([]);

  useEffect(() => {
    onFileSave(filesState);
    console.log(filesState, ";");
  }, [filesState, onFileSave]);

  const previews = filesState.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });
  const uploadSizeLimitInMb = 10;
  return (
    <>
      <Dropzone
        onDrop={(files) => {
          setFiles([...filesState, ...files]);
        }}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={uploadSizeLimitInMb * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        {...props}>
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: rem(220), pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload
              size="3.2rem"
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                ]
              }
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size="3.2rem"
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size="3.2rem"
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text
              size="xl"
              inline>
              Drag images here or click to select files
            </Text>
            <Text
              size="sm"
              color="dimmed"
              inline
              mt={7}>
              Attach as many files as you like, each file should not exceed{" "}
              {uploadSizeLimitInMb}mb
            </Text>
          </div>
        </Group>
      </Dropzone>
      <SimpleGrid
        cols={15}
        mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </>
  );
};

export default ImgDropzone;
