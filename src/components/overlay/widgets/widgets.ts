"use client";

import { widgets } from "@/types/overlay";

type widgetListType = {
  id: string;
  catagory: string;
  widgets: widgets[];
}[];

const widgetList: widgetListType = [
  {
    id: crypto.randomUUID(),
    catagory: "Spotify",
    widgets: [
      {
        id: crypto.randomUUID(),
        category: "Spotify",
        name: "Spotify Queue",
        x_axis: 0,
        y_axis: 0,
        components: [
          {
            id: crypto.randomUUID(),
            componentID: "spotify.queue",
            content: "${song.name} by ${song.artist}",
            name: "Spotify Queue",
            settings: {
              showAlbum: true,
            },
            styles: {
              width: "500px",
              height: "500px",
              backgroundColor: "#0080FF10",
            },
          },

        ],

        styles: {},
      },
      {
        id: crypto.randomUUID(),
        category: "Spotify",
        name: "Spotify New Song",
        x_axis: 0,
        y_axis: 0,
        components: [
          {
            id: crypto.randomUUID(),
            componentID: "spotify-queue",
            content: "",
            name: "Spotify Queue",
            settings: {},
            styles: {},
          },
        ],

        styles: {},
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    catagory: "Twitch",
    widgets: [
      {
        id: crypto.randomUUID(),
        category: "Twitch",
        name: "Follow alert",
        x_axis: 0,
        y_axis: 0,
        components: [
          {
            id: crypto.randomUUID(),
            componentID: "spotify.queue",
            content: "",
            name: "Follow alert",
            settings: {},
            styles: {},
          },
        ],

        styles: {},
      },
      {
        id: crypto.randomUUID(),
        category: "Twitch",
        name: "Sub alert",
        x_axis: 0,
        y_axis: 0,
        components: [
          {
            id: crypto.randomUUID(),
            componentID: "spotify-queue",
            content: "",
            name: "Spotify Queue",
            settings: {},
            styles: {},
          },
        ],

        styles: {},
      },
    ],
  },
];

export { widgetList };
