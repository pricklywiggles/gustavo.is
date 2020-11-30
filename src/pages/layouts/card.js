import {
  Stack,
  Center,
  Box,
  Switcher,
  Sidebar,
  Cover,
  Cluster,
  Frame,
  Imposter,
  Grid,
  Reel
} from "components/layouts";
import * as React from "react";
import { Logo } from "components/logo";
import { css } from "@emotion/core";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";

// eslint-disable-next-line react/display-name
export default function Home() {
  const [count, setCount] = React.useState(0);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => console.log(data);

  const handleChange = (event) => setCount(event.target.value.length);

  console.log("errors", errors);

  return (
    <Center>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <div>
            <Sidebar space="0">
              <label htmlFor="nameInput">Name</label>
              <input
                className={errors.name ? "error" : ""}
                type="text"
                name="name"
                ref={register({
                  required: "Please enter your name",
                  maxLength: 100
                })}
              />
            </Sidebar>
            <Error message={errors.name?.message} />
          </div>
          <div>
            <Sidebar space="0">
              <label htmlFor="emailInput">Email</label>
              <input
                className={errors.email ? "error" : ""}
                type="email"
                name="email"
                ref={register({
                  required: "Please enter your email",
                  maxLength: 320
                })}
              />
            </Sidebar>
            <Error message={errors.email?.message} />
          </div>
          <label htmlFor="message">What&apos;s on your mind?</label>
          <textarea
            className={errors.message ? "error" : ""}
            onChange={handleChange}
            rows="20"
            name="message"
            ref={register({ required: true, maxLength: 2000 })}
          />
          <Sidebar side="right">
            <Count count={2000 - count} />
            <input type="submit" />
          </Sidebar>
        </Stack>
      </Form>
    </Center>
  );
}

const Stuff = styled.div`
  label {
    background-color: blue;
    line-height: 2em;
    height: 2em;
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  & > * {
    width: 100vw;
    margin: auto;
    border: 1px solid darkblue;
  }

  ${Box} {
    border: 0.5px solid red;
    border-radius: 20px;
  }

  ${Stack} {
    border: 1px dashed gray;
    & > * {
      border: 1px dotted yellow;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-flow: column;
  font-weight: bold;

  input,
  textarea {
    background-color: var(--colors-background-darkest);
    border: none;
    color: var(--colors-primary);
  }

  textarea {
    border-radius: var(--s-1);
  }

  .sidebar label {
    border-radius: var(--s1) 0 0 var(--s-1);
    background-color: var(--colors-background-lighter);
    line-height: 3em;
    padding: 0 var(--s1) 0 var(--s1);
    height: 3em;
  }

  .sidebar input {
    border-radius: 0 var(--s1) var(--s-1) 0;
  }

  .error {
    border-right: 10px solid red;
  }
  .error-message {
    font-weight: 400;
    text-align: right;
    padding-top: var(--s-1);
    height: 1em;
  }

  input[type="submit"] {
    border: none;
    width: 100px;
    font-weight: bold;
    align-self: flex-end;
    line-height: 2em;
    border-radius: var(--s-1) var(--s-1) var(--s1) var(--s1);
    color: var(--colors-background);
    background-color: var(--colors-accent);
    &:hover {
      transform: scale(1.05);
    }
    transition: all 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);
  }
`;

const Count = styled.div`
  &::before {
    content: "${(props) => props.count}";
    color: ${(props) =>
      props.count < 0 ? "var(--colors-error)" : "var(--colors-primary)"};
    opacity: 80%;
  }
`;

const Error = styled.div`
  width: 100%;
  position: relative;
  ${(props) =>
    props.message
      ? `
    &::before {
      content: "${props.message}";
      position: absolute;
      width: 100%;
      font-weight: 400;
      color: red;
      text-align: right;
      text-transform: lowercase;
      font-variant: small-caps;
      opacity: 80%;
    }
  `
      : "display: none;"}
`;
