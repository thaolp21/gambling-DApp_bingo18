import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Bingo18Module = buildModule("Bingo18Module", (m) => {
    const bingo18 = m.contract("Bingo18", [
        "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        "24026823401852518150609021090573265269648090150435576283787405584610393488987",
        3,
        10000,
    ]);

    return { bingo18 };
});

export default Bingo18Module;
