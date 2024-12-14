import { useState } from "react";
import { Box, Button, Icon, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react";
import { AiOutlineMinus } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import NavTitle from "./NavTitle";

const FilterByPrice = (props) => {
  const { onChange } = props;
  const [values, setValues] = useState({
    price_gte: "",
    price_lte: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (onChange) {
      onChange(values);
      setValues({
        price_gte: "",
        price_lte: "",
      });
    }
  };

  return (
    <Box w="100%">
      <NavTitle title="Shop by Price" />
      <Stack spacing={2} mb="14px">
        <InputGroup>
          <Input
            type="number"
            variant="flushed"
            placeholder="Nhập số bắt đầu"
            name="price_gte"
            value={values.price_gte}
            onChange={(e) => handleInputChange(e)}
          />
          <InputRightElement pointerEvents="none" color="gray.300" fontSize="1.2em">
            ₫
          </InputRightElement>
        </InputGroup>

        <Icon as={AiOutlineMinus} />

        <InputGroup>
          <Input
            type="number"
            variant="flushed"
            placeholder="Nhập số kết thúc"
            name="price_lte"
            value={values.price_lte}
            onChange={(e) => handleInputChange(e)}
          />
          <InputRightElement pointerEvents="none" color="gray.300" fontSize="1.2em">
            ₫
          </InputRightElement>
        </InputGroup>
      </Stack>

      <Button leftIcon={<FiFilter />} colorScheme="gray" variant="solid" onClick={handleSubmit}>
        Áp dụng
      </Button>
    </Box>
  );
};

export default FilterByPrice;
