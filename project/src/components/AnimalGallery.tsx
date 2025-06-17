import React from "react";

const animalImageNames = [
  "bee-1864595.png",
  "penguin-1864572.png",
  "sheep-1864535.png",
  "dog-1864532.png",
  "owl-1864521.png",
  "panda-bear-1864516.png",
  "cat-1864514.png",
  "swan-1864494.png",
  "duck-1864493.png",
  "rabbit-1864488.png",
  "horse-1864486.png",
  "snail-1864485.png",
  "fish-1864484.png",
  "monkey-1864483.png",
  "crab-1864481.png",
  "hen-1864470.png",
  "whale-3065742.png",
  "zebra-3065747.png",
  "wolf-3065743.png",
  "starfish-3065740.png",
  "tiger-3065741.png",
  "snake-3065738.png",
  "seal-3065736.png",
  "seahorse-3065735.png",
  "octopus-3065730.png",
  "lion-3065729.png",
  "kangaroo-3065726.png",
  "fox-3065706.png",
  "giraffe-3065712.png",
  "elephant-3065702.png",
  "dolphin-3065698.png",
  "deer-3065695.png",
  "bear-3065687.png",
  "mouse-1067852.png",
  "frog-1067846.png",
  "parrot-1067837.png",
  "rabbit-1067831.png",
  "fish-1067826.png",
  "turtle-1067822.png",
  "hamster-1067820.png",
  "dog-1067817.png",
  "cat-1067809.png",
  "duck-1449800.png",
  "cow-1449793.png",
  "chicken-1449791.png"
];

export default function AnimalGallery() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {animalImageNames.map((name) => (
        <img
          key={name}
          src={`/images/animals/easy/${name}`}
          alt={name.replace(/\.[^/.]+$/, "")}
          style={{ width: 120, height: 120, objectFit: "contain", border: "1px solid #eee", borderRadius: 8 }}
        />
      ))}
    </div>
  );
} 