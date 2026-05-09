import Package from "../models/Packages/Package.js";
import SafariLanding from "../models/SafariLanding/Safarilanding.js";
import DestinationLanding from "../models/DestinationDetails/Destinationlandind.js";
import DestinationDetails from "../models/DestinationDetails/Destinationdetails.js";
import TravelGuide from "../models/Travelguide/Blog.js";
import TravelGroup from "../models/Traelgroup/Travelgroup.js";
import Team from "../models/Team/Team.js";
import About from "../models/About/About.js";
import Fleet from "../models/Fleet/Fleet.js";
import Kilimanjaro from "../models/KilimanjaroLanding/Kilimanjarolanding.js";
import Zanzibar from "../models/Zanzibar/Zanzibar.js";

export const searchAll = async (req, res) => {
  const { q } = req.query;

  try {
    const regex = new RegExp(q, "i");

    const [
      packages,
      safaris,
      destinations,
      destinationdetails,
      travelguides,
      travelgroups,
      teams,
      abouts,
      fleets,
      kilimanjaros,
      zanzibars
    ] = await Promise.all([
      Package.find({ title: regex }),
      SafariLanding.find({ title: regex }),
      DestinationLanding.find({ title: regex }),
      DestinationDetails.find({title: regex}),
      TravelGuide.find({ title: regex }),
      TravelGroup.find({ title: regex }),
      Team.find({ name: regex }),
      About.find({ title: regex }),
      Fleet.find({ title: regex }),
      Kilimanjaro.find({ title: regex }),
      Zanzibar.find({ title: regex })
    ]);

    const results = [
      ...packages.map(i => ({ ...i.toObject(), type: "package",label:"Packages", slug: i.slug })),
      ...safaris.map(i => ({ ...i.toObject(), type: "safari",label: " safari",slug: i.slug })),
      ...destinations.map(i => ({ ...i.toObject(), type: "destination",slug: i.slug })),
      ...destinationdetails.map(i => ({ ...i.toObject(), type: "destinationdetails",label: "tanzania destinations",slug: i.slug })),
      ...travelguides.map(i => ({ ...i.toObject(), type: "travelguide",label: "Travel Guide",slug: i.slug })),
      ...travelgroups.map(i => ({ ...i.toObject(), type: "travelgroup",label: "Travel Group",slug: i.slug })),
      ...teams.map(i => ({ ...i.toObject(), type: "team" ,slug: i.slug})),
      ...abouts.map(i => ({ ...i.toObject(), type: "about",slug: i.slug })),
      ...fleets.map(i => ({ ...i.toObject(), type: "fleet",slug: i.slug })),
      ...kilimanjaros.map(i => ({ ...i.toObject(), type: "kilimanjaro",slug: i.slug })),
      ...zanzibars.map(i => ({ ...i.toObject(), type: "zanzibar",slug: i.slug }))
    ];

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
};

