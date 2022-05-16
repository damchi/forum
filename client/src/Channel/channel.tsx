import {gql, useQuery} from "@apollo/client";
import {useEffect} from "react";

const ALL_Channels = gql`
  query allChannels {
    channels {
      id
      name
    }
  }
`;

const CHANNEL_SUBSCRIPTION = gql`
  subscription OnNewChannel {
    channelCreated {
      id
      name
    }
  }
`;

const Channels = () => {
    const { loading, error, data, subscribeToMore } = useQuery(ALL_Channels);
    useEffect(() => {
        subscribeToMore({
            document: CHANNEL_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newChannel = subscriptionData.data.channelCreated;
                return {
                    channels: [...prev.channels, newChannel],
                };
            },
        });
    }, [subscribeToMore]);

    if (loading) return <p>"Loading...";</p>;
    if (error) return <p>`Error! ${error.message}`</p>;
    return (
        <div>
            {data.channels.map((channel: any) => (
                <div key={channel.id}>
                    <p>
                        {channel.name}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Channels;