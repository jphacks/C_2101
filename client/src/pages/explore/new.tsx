import {
  Text,
  Button,
  Textarea,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Layout from "../../components/layout";
import NextLink from "next/link";

import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);

import "react-datepicker/dist/react-datepicker.css";
import { parseAsMoment } from "../../utils/datetime";

const CreateSpace: React.VFC = () => {
  const initialDate = new Date();

  const [startDate, setStartDate] = useState(new Date());
  return (
    <Layout>
      <Stack spacing={4} maxWidth={500} margin="auto" paddingBottom={200}>
        <Text fontSize="4xl" fontWeight="bold" marginBottom="6" marginTop="12">
          スペースを作成する
        </Text>
        <Text marginTop={18} fontWeight="bold">
          イベントのタイトル
        </Text>
        <Input placeholder="イベントのタイトル"></Input>
        <Text marginTop={18} fontWeight="bold">
          イベントの説明
        </Text>
        <Textarea placeholder="イベントの説明"></Textarea>
        <Text marginTop={18} fontWeight="bold">
          開始時間の選択
        </Text>
        <DatePicker
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          showTimeSelect
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
          locale="ja"
          //   inline
          customInput={
            <Button>
              {parseAsMoment(startDate).format("YYYY/MM/DD HH:mm")}
            </Button>
          }
        />
        <Text marginTop={18} fontWeight="bold">
          終了時間の選択
        </Text>
        <DatePicker
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          showTimeSelect
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
          locale="ja"
          //   inline
          customInput={
            <Button>{parseAsMoment(endDate).format("YYYY/MM/DD HH:mm")}</Button>
          }
        />
        <Text marginTop={18} fontWeight="bold">
          プレゼンテーション持ち時間
        </Text>
        <Stack direction={["column", "row"]} spacing="24px" alignItems="center">
          <NumberInput defaultValue={10} min={1} max={190} maxWidth={100}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>分</Text>
        </Stack>
        <Text marginTop={18} fontWeight="bold">
          質問時間
        </Text>
        <Stack direction={["column", "row"]} spacing="24px" alignItems="center">
          <NumberInput defaultValue={3} min={0} max={60} maxWidth={100}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>分</Text>
        </Stack>

        <Button marginTop={42}>作成する</Button>
      </Stack>
    </Layout>
  );
};

export default CreateSpace;
