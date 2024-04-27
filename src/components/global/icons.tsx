import React from "react";
import { BsSpotify, BsTwitch } from "react-icons/bs";

interface Props {
  icon: string;
}

export default function Icons({ icon }: Props): JSX.Element {
  switch (icon) {
    case "spotify":
      return <BsSpotify />;

    case "twitch":
      return <BsTwitch />

    default:
      return (
        <div>
          <h1>Icon not found</h1>
        </div>
      );
  }
}
