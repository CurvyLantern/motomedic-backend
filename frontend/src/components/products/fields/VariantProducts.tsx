import { SelectColorField } from "@/components/fields/color/MultiSelectColorField";
import { useAttributeQuery } from "@/queries/attributeQuery";
import { useProductSelectData } from "@/selectInputData/SelectInputDatas";
import { Attribute } from "@/types/defaultTypes";
import {
  Box,
  Button,
  Grid,
  Modal,
  NumberInput,
  Select,
  SelectItem,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  createStyles,
  rem,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import React, { useEffect, useMemo, useState } from "react";
import { ProductFormValues } from "../CreateProductForm";
import { modals } from "@mantine/modals";
import { FilteredElementKeyMap } from "recharts/types/util/types";
import { CrudDeleteButton } from "@/components/common/CrudOptions";

type VariantProducts = {
  form: UseFormReturnType<ProductFormValues>;
  hidden?: boolean;
  filteredProductModelData: SelectItem[];
};
const VariantProducts = ({
  form,
  hidden = true,
  filteredProductModelData,
}: VariantProducts) => {
  // const variants = useAppSelector((state) => state.product.variants);
  const attributes = useAttributeQuery();
  const { selectColorsData } = useProductSelectData();
  const attibuteSelectArr = useMemo(() => {
    return attributes
      ? attributes
          .map((a) =>
            a.values.map((v) => ({
              label: v.name,
              value: String(v.id),
              group: a.name,
            }))
          )
          .flat(1)
      : [];
  }, [attributes]);
  const { ref, height } = useElementSize();

  const trows = form.values.variations
    ? form.values.variations.map((variant, variantIdx) => {
        return (
          <VariantProductTableRow
            key={variantIdx}
            form={form}
            colorSelectArr={selectColorsData}
            attibuteSelectArr={attibuteSelectArr}
            attributes={attributes}
            variant={variant}
            filteredProductModelData={filteredProductModelData}
            variantIdx={variantIdx}
          />
        );
      })
    : null;
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.white,
        display: hidden ? "none" : "initial",
        position: "relative",
      })}
    >
      <div style={{ opacity: 0, height }}></div>
      <Box
        ref={ref}
        sx={{
          position: "absolute",
          top: 0,
          maxWidth: "100%",
          width: "100%",
          minWidth: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          horizontalSpacing="xs"
          verticalSpacing="xs"
          highlightOnHover
          withBorder
          withColumnBorders
        >
          <thead>
            <tr>
              <th style={{ minWidth: 200 }}>Variant Name</th>
              <th>Attributes</th>
              <th style={{ minWidth: 200 }}>Barcode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{trows}</tbody>
        </Table>
      </Box>
    </Box>
  );
};

const useAttributeModalStyles = createStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: rem(10),
  },
});
const VariantProductTableRow = ({
  colorSelectArr,
  variant,
  variantIdx,
  form,
  attibuteSelectArr,
  attributes,
  filteredProductModelData,
}: VariantProducts & {
  variant: {
    color_id: string;
    model_id: string;
    attribute_value_ids: string[];
  };
  variantIdx: number;
  colorSelectArr: SelectItem[];
  attributes?: Attribute[];
  attibuteSelectArr: SelectItem[];
}) => {
  const { classes } = useAttributeModalStyles();
  const [variantName, setVariantName] = useState("");
  useEffect(() => {
    const colorLabel = colorSelectArr.find(
      (c) => c.value === variant.color_id
    )?.label;
    const attrLabels = variant.attribute_value_ids.map(
      (id) => attibuteSelectArr.find((a) => a.value === id)?.label
    );
    const modelLabel = filteredProductModelData.find(
      (m) => m.value === variant.model_id
    )?.label;
    const variantName = [
      form.values.name,
      modelLabel ? modelLabel : "",
      colorLabel ? colorLabel : "",
      ...attrLabels,
    ]
      .filter(Boolean)
      .join("-");
    setVariantName(variantName);
  }, [
    filteredProductModelData,
    variant.color_id,
    variant.model_id,
    variant.attribute_value_ids,
    variantIdx,
    colorSelectArr,
    attibuteSelectArr,
    form.values.name,
  ]);
  // useEffect(() => {
  //   // form.setFieldValue(`variations.${variantIdx}.name`, variantName);
  // }, [variantName]);

  const [
    attributeModalOpened,
    { open: openAttributeModal, close: closeAttributeModal },
  ] = useDisclosure(false);

  // const filteredColorsData = useMemo(() => {
  //   return colorSelectArr.filter(
  //     (colorData) =>
  //       !form.values.variations
  //         .filter((_, index) => index !== variantIdx)
  //         .find(
  //           (variation) => variation.color_id.toString() === colorData.value
  //         )
  //   );
  // }, [colorSelectArr, form.values.variations, variantIdx]);

  const filteredAttributes = useMemo(() => {
    if (!attributes) return [];
    return attributes.map((attr) => {
      const attribute_values = attr.values
        .filter((attrValue) => {
          return !form.values.variations
            .filter((_, index) => index !== variantIdx)
            .find((variation) =>
              variation.attribute_value_ids.includes(attrValue.id.toString())
            );
        })
        .map((attrValue) => ({
          label: attrValue.name,
          value: attrValue.id.toString(),
        }));
      return {
        label: attr.name,
        value: attr.id.toString(),
        attribute_values,
      };
    });
  }, [attributes, variantIdx, form.values.variations]);

  return (
    <tr key={variantIdx}>
      <td>{variantName}</td>
      <td>
        <Modal
          title="Select attributes"
          centered
          opened={attributeModalOpened}
          onClose={closeAttributeModal}
          styles={{
            content: {
              // @ts-expect-error using important
              overflowY: "visible !important",
            },
          }}
        >
          {/* {JSON.stringify(attributes)} */}
          <Box className={classes.grid}>
            {/* Product Model */}
            <Box
              sx={(t) => ({
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
              })}
              // span={3}
            >
              <Text
                sx={(t) => ({
                  display: "flex",
                  alignItems: "center",
                  paddingInline: t.spacing.xs,
                  borderRadius: t.radius.sm,
                  width: "100%",
                  height: "100%",
                  backgroundColor: t.colors.gray[3],
                })}
              >
                Model
              </Text>
            </Box>

            <Box>
              <Select
                onClick={() => {
                  if (form.values.model_id) {
                    modals.open({
                      modalId: "variationModelModal",
                      centered: true,
                      withCloseButton: true,
                      children: (
                        <Stack>
                          <Box>Variation products cannot have own model</Box>
                          <SimpleGrid cols={2}>
                            <Button
                              onClick={() => {
                                form.setFieldValue("model_id", "");
                                modals.close("variationModelModal");
                              }}
                            >
                              Clear product model
                            </Button>
                            <Button
                              onClick={() => {
                                form.setFieldValue("variation_enabled", false);
                                modals.close("variationModelModal");
                              }}
                            >
                              Turn off Variation
                            </Button>
                          </SimpleGrid>
                        </Stack>
                      ),
                    });
                  }
                }}
                {...form.getInputProps(`variations.${variantIdx}.model_id`)}
                data={filteredProductModelData}
              />
            </Box>

            {/* Product color */}

            <Box
              sx={(t) => ({
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
              })}
            >
              <Text
                sx={(t) => ({
                  display: "flex",
                  alignItems: "center",
                  paddingInline: t.spacing.xs,
                  borderRadius: t.radius.sm,
                  width: "100%",
                  height: "100%",
                  backgroundColor: t.colors.gray[3],
                })}
              >
                Color
              </Text>
            </Box>

            <Box>
              <SelectColorField
                {...form.getInputProps(`variations.${variantIdx}.color_id`)}
                colors={colorSelectArr}
              ></SelectColorField>
            </Box>

            {filteredAttributes?.map((attribute, attributeIdx) => {
              return (
                <React.Fragment key={attribute.value}>
                  <Box
                    sx={(t) => ({
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                    })}
                  >
                    <Text
                      sx={(t) => ({
                        display: "flex",
                        alignItems: "center",
                        paddingInline: t.spacing.xs,
                        borderRadius: t.radius.sm,
                        width: "100%",
                        height: "100%",
                        backgroundColor: t.colors.gray[3],
                      })}
                    >
                      {attribute.label}
                    </Text>
                  </Box>
                  <Box>
                    <Select
                      allowDeselect
                      dropdownPosition="bottom"
                      dropdownComponent="div"
                      {...form.getInputProps(
                        `variations.${variantIdx}.attribute_value_ids.${attributeIdx}`
                      )}
                      // value={
                      //   form.values.variations[variantIdx].attribute_value_ids[
                      //     attributeIdx
                      //   ]
                      // }
                      // onChange={(val) => {
                      //   form.setFieldValue(
                      //     `variations.${variantIdx}.attribute_value_ids.${attributeIdx}`,
                      //     val
                      //   );
                      // }}
                      data={attribute.attribute_values}
                    />
                  </Box>
                </React.Fragment>
              );
            })}
          </Box>
        </Modal>
        <Button variant="outline" onClick={openAttributeModal}>
          Select Attributes
        </Button>
      </td>
      <td>
        <TextInput
          placeholder="Enter barcode"
          {...form.getInputProps(`variations.${variantIdx}.barcode`)}
          onClick={() => {
            if (form.values.barcode) {
              modals.open({
                modalId: "variationBarcodeModal",
                centered: true,
                withCloseButton: true,
                children: (
                  <Stack>
                    <Box>Variation products cannot have own barcode</Box>
                    <SimpleGrid cols={2}>
                      <Button
                        onClick={() => {
                          form.setFieldValue("barcode", "");
                          modals.close("variationBarcodeModal");
                        }}
                      >
                        Clear Barcode
                      </Button>
                      <Button
                        onClick={() => {
                          form.setFieldValue("variation_enabled", false);
                          modals.close("variationBarcodeModal");
                        }}
                      >
                        Turn off Variation
                      </Button>
                    </SimpleGrid>
                  </Stack>
                ),
              });
            }
          }}
        />
      </td>
      {/* <td>
        <NumberInput
          {...form.getInputProps(`variations.${variantIdx}.price`)}
          defaultValue={variant.price}
        ></NumberInput>
      </td> */}
      {/* <td>sku</td> */}
      {/* <td>
        <FileButton {...form.getInputProps(`variations.${variantIdx}.image`)}>
          {(props) => <Button {...props}>Upload</Button>}
        </FileButton>
      </td> */}

      <td>
        <CrudDeleteButton
          onDelete={() => {
            form.removeListItem("variations", variantIdx);
          }}
        />
      </td>
    </tr>
  );
};

export default VariantProducts;
