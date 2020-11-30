import { Stack, Center, Sidebar, Imposter, Box } from "components/layouts";
import * as React from "react";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";

export function ContactForm() {
  const [count, setCount] = React.useState(0);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    console.log("Submitting", data);
    fetch("/api/contact", { method: "POST", body: JSON.stringify(data) });
  };

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
          <div>
            <textarea
              className={errors.message ? "error" : ""}
              onChange={handleChange}
              rows="10"
              name="message"
              ref={register({
                required: "You forgot to write something",
                maxLength: 2000
              })}
            />
            <Error message={errors.message?.message} />
          </div>
          <Sidebar side="right">
            <Count count={2000 - count} />
            <button type="submit">Send</button>
          </Sidebar>
        </Stack>
        {/* <Imposter>
          <Stack className="confirmation">
            <p>It’s decision time, sunshine!</p>
            <button type="button">Ok</button>
          </Stack>
        </Imposter> */}
      </Form>
    </Center>
  );
}

const Form = styled.form`
  position: relative;
  display: flex;
  flex-flow: column;
  font-weight: bold;
  padding: var(--s1);

  input,
  textarea {
    background-color: var(--colors-background-darkest);
    border: none;
    color: var(--colors-primary);
  }

  textarea {
    border-radius: var(--s-1);
    width: calc(100% - var(--s0));
  }

  .sidebar label {
    border-radius: var(--s1) 0 0 var(--s-1);
    background-color: var(--colors-background-lighter);
    line-height: 2.5em;
    padding: 0 var(--s1) 0 var(--s1);
    height: 2.5em;
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

  button[type="submit"] {
    border: none;
    font-weight: bold;
    align-self: flex-end;
    line-height: 1.5em;
    border-radius: var(--s-1);
    padding: var(--s-3) var(--s0) var(--s-3) var(--s0);
    color: var(--colors-background);
    background-color: var(--colors-accent);
    opacity: 80%;
    &:hover {
      transform: scale(1.05);
      opacity: 100%;
    }
    &:active {
      transform: scale(0.95);
      opacity: 100%;
    }
    transition: all 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);
  }

  &::after {
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .confirmation {
    background-color: rgba(var(--colors-background-rgb), 0.5);
    backdrop-filter: blur(10px);
    ${"" /* display: flex;
    flex-flow: column;
    width: 655px;
    height: 450px;
    justify-content: center;

    z-index: 1;
    button {
      align-self: center;
      justify-self: flex-end;
    } */}
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
