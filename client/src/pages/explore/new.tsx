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
import DatePicker, { registerLocale } from "react-datepicker";
import client from "../../utils/api-client.factory";
import { useLogin } from "../../hooks/useLogin";
import "react-datepicker/dist/react-datepicker.css";
import { parseAsMoment } from "../../utils/datetime";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);

const CreateSpace: React.VFC = () => {
  const initialDate = new Date();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [presentationTimeLimit, setPresentationTimeLimit] =
    useState<number>(10);
  const [questionTimeLimit, setQuestionTimeLimit] = useState<number>(3);

  const { authHeader } = useLogin();
  const create = async () => {
    await client.api.rooms.$post({
      body: {
        description: description,
        startAt: parseAsMoment(startDate).toISOString(),
        finishAt: parseAsMoment(endDate).toISOString(),
        presentationTimeLimit: presentationTimeLimit,
        questionTimeLimit: questionTimeLimit,
        title: title,
      },
      config: {
        headers: {
          Authorization: authHeader,
        },
      },
    });
  };
  return (
    <Layout>
      <Stack spacing={4} maxWidth={500} margin="auto" paddingBottom={100}>
        <Text fontSize="4xl" fontWeight="bold" marginBottom="6" marginTop="12">
          スペースを作成する
        </Text>
        <Text marginTop={18} fontWeight="bold">
          イベントのタイトル
        </Text>
        <Input
          placeholder="イベントのタイトル"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        ></Input>
        <Text marginTop={18} fontWeight="bold">
          イベントの説明
        </Text>
        <Textarea
          placeholder="イベントの説明"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        ></Textarea>
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
          発表時間
        </Text>
        <Stack direction={["column", "row"]} spacing="24px" alignItems="center">
          <NumberInput
            min={1}
            max={190}
            maxWidth={100}
            value={presentationTimeLimit}
            onChange={(value) => {
              setPresentationTimeLimit(Number(value));
            }}
          >
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
          <NumberInput
            min={0}
            max={60}
            maxWidth={100}
            value={questionTimeLimit}
            onChange={(value) => setQuestionTimeLimit(Number(value))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>分</Text>
        </Stack>

        <Button marginTop={42} onClick={create}>
          作成する
        </Button>
      </Stack>
    </Layout>
  );
};

export default CreateSpace;
