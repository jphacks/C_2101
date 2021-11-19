import { keyframes } from "@chakra-ui/react";
const shake = keyframes`
  0% {
    transform: translateX(0);
  }

  6.5% {
    transform: translateX(-6px) rotateY(-9deg) rotateZ(-9deg);
  }

  18.5% {
    transform: translateX(5px) rotateY(7deg) rotateZ(7deg);
  }

  31.5% {
    transform: translateX(-3px) rotateY(-5deg) rotateZ(-5deg);
  }

  43.5% {
    transform: translateX(2px) rotateY(3deg) rotateZ(3deg);
  }

  50% {
    transform: translateX(0);
  }
`;
export { shake };