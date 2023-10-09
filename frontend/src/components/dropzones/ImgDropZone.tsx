import {
  Group,
  Image,
  Text,
  useMantineTheme,
  rem,
  SimpleGrid,
} from "@mantine/core";
import { TbUpload, TbPhoto, TbX } from "react-icons/tb";
import {
  DropzoneProps,
  Dropzone,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { useEffect, useState } from "react";

// const IMAGE_MIME_TYPE = ["image/jpg"];

const ImgDropzone: React.FC<Omit<DropzoneProps, "children">> = ({
  onDrop,
  ...props
}) => {
  const theme = useMantineTheme();
  const [filesState, setFiles] = useState<FileWithPath[]>([]);

  useEffect(() => {
    onDrop(filesState);
  }, [filesState, onDrop]);

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
        {...props}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: rem(220), pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <TbUpload
              size="3.2rem"
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                ]
              }
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <TbX
              size="3.2rem"
              color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <TbPhoto size="3.2rem" />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed{" "}
              {uploadSizeLimitInMb}mb
            </Text>
          </div>
        </Group>
      </Dropzone>
      <SimpleGrid cols={15} mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </>
  );
};

export default ImgDropzone;
