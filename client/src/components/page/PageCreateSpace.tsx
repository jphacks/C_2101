import React, { useCallback, useState } from "react";
import {
  Button,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Image,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { parseAsMoment } from "../../utils/datetime";
import Layout from "../Layout";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useCreateRoom } from "../../lib/hooks/useCreateRoom";
registerLocale("ja", ja);

export const PageCreateSpace = () => {
  const [startDate, setStartDate] = useState<Date>(() =>
    moment().hours(2).toDate()
  );
  const [endDate, setEndDate] = useState<Date>(() =>
    moment().hours(4).toDate()
  );
  const [isEndDateEdited, setIsEndDateEdited] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [presentationLimitMinute, setPresentationLimitMinute] =
    useState<number>(10);
  const [questionLimitMinute, setQuestionLimitMinute] = useState<number>(3);

  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileBase64, setFileBase64] = useState<string>();

  const toast = useToast();
  const router = useRouter();

  const createRoom = useCreateRoom();

  const handleSubmitCreate = useCallback(async () => {
    if (!title || !description) {
      toast({
        title: "タイトル・説明は必須です",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
      return;
    }

    createRoom({
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      presentationTimeMinute: presentationLimitMinute,
      questionTimeMinute: questionLimitMinute,
      imageBase64: fileBase64,
    })
      .then(() => {
        toast({
          title: "スペース予定を作成しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/explore");
      })
      .catch((error) => {
        toast({
          title: error.toString(),
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      });
  }, [
    createRoom,
    description,
    endDate,
    fileBase64,
    presentationLimitMinute,
    questionLimitMinute,
    router,
    startDate,
    title,
    toast,
  ]);

  const handleSetStartDate = (date: Date) => {
    //開催日時が変更された場合、終了日時を2時間後に設定する
    setStartDate(date);

    if (!isEndDateEdited) {
      setEndDate(moment(date).hours(2).toDate());
    }
  };

  const handleSetEndDate = useCallback(
    (date: Date) => {
      setEndDate(date);
      setIsEndDateEdited(true);
    },
    [setEndDate, setIsEndDateEdited]
  );

  const handleFileSelected = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      const allowFileTypes = ["image/jpeg", "image/png"];

      if (!file || !allowFileTypes.includes(file.type)) {
        setFileUrl("");
        return;
      }

      const imgUrl = URL.createObjectURL(file);
      setFileUrl(imgUrl);

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (!event.target || !event.target.result) return;
        const content = event.target.result as string;
        setFileBase64(content.slice(content.indexOf(",") + 1));
      };
      fileReader.readAsDataURL(file);
    },
    [setFileUrl, setFileBase64]
  );

  return (
    <Layout>
      <Stack spacing={4} maxWidth={500} margin="auto" paddingBottom={50}>
        <Text fontSize="4xl" fontWeight="bold" marginBottom="6" marginTop="12">
          スペースを作成する
        </Text>
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          イベントのタイトル
        </Text>
        <Input
          placeholder="イベントのタイトル"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          イベントの説明
        </Text>
        <Textarea
          placeholder="イベントの説明"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          開始時間の選択
        </Text>
        <CommonDatePicker
          selectedDate={startDate}
          onChangeDate={handleSetStartDate}
        />
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          終了時間の選択
        </Text>
        <CommonDatePicker
          selectedDate={endDate}
          onChangeDate={handleSetEndDate}
        />
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          発表時間
        </Text>
        <Stack direction={["column", "row"]} spacing="24px" alignItems="center">
          <NumberInput
            min={1}
            max={190}
            maxWidth={100}
            value={presentationLimitMinute}
            onChange={(value) => {
              setPresentationLimitMinute(Number(value));
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
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          質問時間
        </Text>
        <Stack direction={["column", "row"]} spacing="24px" alignItems="center">
          <NumberInput
            min={0}
            max={60}
            maxWidth={100}
            value={questionLimitMinute}
            onChange={(value) => setQuestionLimitMinute(Number(value))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>分</Text>
        </Stack>
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          サムネイル画像
        </Text>
        <input type="file" accept="image/*" onChange={handleFileSelected} />
        {fileUrl && (
          <Image src={fileUrl} alt="preview" width={100} height={100} />
        )}
        <Button
          marginTop="42px"
          onClick={handleSubmitCreate}
          bg="teal.400"
          color="white"
          _hover={{
            bg: "teal.500",
          }}
        >
          作成する
        </Button>
      </Stack>
    </Layout>
  );
};

const CommonDatePicker: React.VFC<{
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}> = ({ selectedDate, onChangeDate }) => (
  <DatePicker
    selected={selectedDate}
    onChange={onChangeDate}
    showTimeSelect
    timeFormat="p"
    timeIntervals={15}
    dateFormat="Pp"
    locale="ja"
    //   inline
    customInput={
      <Button>{parseAsMoment(selectedDate).format("YYYY/MM/DD HH:mm")}</Button>
    }
  />
);
