import { useState, FC } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_CHANNEL = gql`
  mutation createChannel($name: String!) {
    createChannel(name: $name) {
      id
      name
    }
  }
`;

interface CreateChannelProps {
    name: string;
}

const CreateChannel: FC<CreateChannelProps> = () => {
    const [input, setInput] = useState<string>("");
    const [sendChannel ] = useMutation(CREATE_CHANNEL);

    const handleSend = () => {
        sendChannel({ variables: { name: input} })
            .then(() => {
                setInput("");
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <input
                type="text"
                id="channel"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></input>
            <button onClick={handleSend}>Create channel</button>
        </div>
    );
};

export default CreateChannel;