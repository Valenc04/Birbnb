import Checkbox from "./generic/Checkbox";

const SearchCheckboxes = ({
  initialWifi = false,
  initialPool = false,
  initialPets = false,
  initialParking = false
}) => (
  <div className="features-grid">
    <Checkbox id="wifi" label="Wi-Fi" defaultChecked={initialWifi} />
    <Checkbox id="pool" label="Piscina" defaultChecked={initialPool} />
    <Checkbox id="pets" label="Mascotas" defaultChecked={initialPets} />
    <Checkbox id="parking" label="Estacionamiento" defaultChecked={initialParking} />
  </div>
);

export default SearchCheckboxes;