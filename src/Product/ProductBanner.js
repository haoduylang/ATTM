import { useState } from "react";
import { Tabs, TabList, Tab, TabIndicator, Box } from "@chakra-ui/react";
import CustomSelect from "../Custom/CustomSelect";

const ProductBanner = (props) => {
  const { currentSort, onSortChange, onPageSizeChange } = props;
  const [value, setValue] = useState(12);
  const items = [
    {
      label: "12 sản phẩm",
      value: 12,
    },
    {
      label: "24 sản phẩm",
      value: 24,
    },
    {
      label: "36 sản phẩm",
      value: 36,
    },
    {
      label: "48 sản phẩm",
      value: 48,
    },
  ];

  const handleSortChange = (index) => {
    const newSortValue = index === 0 ? "asc" : "desc";
    if (onSortChange) onSortChange(newSortValue);
  };

  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      setValue(newSize);
      onPageSizeChange(newSize);
    }
  };

  return (
    <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
      {/* =========================================================
                            Left Part Start here
        ======================================================== */}

      <Box>
        <Tabs
          index={currentSort === "asc" ? 0 : 1}
          onChange={(index) => handleSortChange(index)}
          position="relative"
          variant="unstyled"
        >
          <TabList>
            <Tab>Giá thấp tới cao</Tab>
            <Tab>Giá cao tới thấp</Tab>
          </TabList>
          <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
        </Tabs>
      </Box>
      {/* =========================================================
                            Left Part End here
        ======================================================== */}
      {/* =========================================================
                            Right Part STart here
        ======================================================== */}

      <Box>
        <CustomSelect
          items={items}
          onChange={(newValue) => handlePageSizeChange(newValue)}
          value={value}
        />
      </Box>
      {/* =========================================================
                            Right Part End here
        ======================================================== */}
    </Box>
  );
};

export default ProductBanner;
