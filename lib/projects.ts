export interface Project {
  id: string;
  title: string;
  client: string;
  tag: string;
  hero: string;
  images: string[];
}

export const projects: Project[] = [
  {
    id: "charles-jeffrey",
    title: "Charles Jeffrey",
    client: "Loverboy AW26",
    tag: "LOVERBOY",
    hero: "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623150031_18555562114049629_4561727935106711870_n.jpg",
    images: [
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623150031_18555562114049629_4561727935106711870_n.jpg",
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623188765_18555562087049629_1961662255239748413_n.jpg",
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623244814_18555561967049629_8843520828202525758_n.jpg",
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623260991_18555562105049629_5862304937960565420_n.jpg",
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623410858_18555561952049629_597109895623438497_n.jpg",
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623684884_18555562132049629_3473887989823582132_n.jpg",
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_623818267_18555562096049629_4313146382953975053_n.jpg",
      "/assets/images/charles-jeffrey-for-LOVERBOY-AW26/SnapInsta.to_624103499_18555562123049629_5953648296067372695_n.jpg",
    ],
  },
  {
    id: "pauline",
    title: "Pauline",
    client: "Re-Edition Magazine",
    tag: "RE-EDITION",
    hero: "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_713423713_18593937925049629_3943760639402107657_n.jpg",
    images: [
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_713423713_18593937925049629_3943760639402107657_n.jpg",
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_718993577_18595437664049629_7283457365363461900_n.jpg",
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_719217306_18595437679049629_1544234848881238646_n.jpg",
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_719813243_18595641211049629_1180834435769891498_n.jpg",
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_720179366_18595641340049629_6390601676645035784_n.jpg",
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_720282817_18595437682049629_1376141929601277820_n.jpg",
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_720467774_18595641202049629_7772718516240875357_n.jpg",
      "/assets/images/pauline-for-re-edition-magazine/SnapInsta.to_721411011_18595641235049629_294188209258246076_n.jpg",
    ],
  },
  {
    id: "poised-and-posed",
    title: "Poised and Posed",
    client: "Icon America",
    tag: "ICON AMERICA",
    hero: "/assets/images/poised-and-posed-for-icon-america/SnapInsta.to_701841947_18589635310049629_1533917827378587836_n.jpg",
    images: [
      "/assets/images/poised-and-posed-for-icon-america/SnapInsta.to_701841947_18589635310049629_1533917827378587836_n.jpg",
      "/assets/images/poised-and-posed-for-icon-america/SnapInsta.to_703097733_18589635271049629_1338047502622001846_n.jpg",
      "/assets/images/poised-and-posed-for-icon-america/SnapInsta.to_706726978_18591450721049629_4789090667135916186_n.jpg",
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
