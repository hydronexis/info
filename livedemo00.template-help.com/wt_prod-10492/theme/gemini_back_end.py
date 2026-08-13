import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from google.genai import types


# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)


# Leer la clave desde .env
GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY",
    ""
).strip()


# Conserva el modelo que ya te funciona
GEMINI_MODEL = "gemini-3.5-flash-lite"


# Información y reglas del asistente
HYDRONEXIS_SYSTEM_INSTRUCTION = """
HYDRONEXIS — KNOWLEDGE BASE IN PARAGRAPHS

1. PROJECT IDENTITY

HYDRONEXIS's mission is to democratize access to fresh, ecological, agrochemical-free food through accessible solar hydroponic technology, inclusive education, and an interactive digital ecosystem that empowers households, schools, and vulnerable communities to achieve food self-sufficiency. Its vision is to become, by 2030, the leading platform for urban agtech and social impact in Panama and Latin America, transforming local vegetable production through clean energy, artificial intelligence applied to self-cultivation, and community networks of sustainable production. Its strategic objectives focus on three fronts: monetization and financial sustainability through the sale of autonomous hydroponic hardware, mobile app memberships, themed seed kits, and an inclusive Marketplace; inclusion and agro-educational equity, breaking the myth that hydroponics is exclusive to professionals or high socioeconomic levels; and technological optimization through cultivation algorithms and intelligent monitoring of critical variables such as pH, nutrients, and temperature.

2. PROBLEM DIAGNOSIS AND MARKET CONTEXT

The high cost of fresh vegetables in supermarkets severely limits access to healthy diets for middle- and low-income families, turning clean nutrition into an exclusionary privilege. Added to this is the vulnerability of traditional hydroponic systems, which suffer catastrophic losses during power outages, a recurring problem in various regions of the country. Multidimensional poverty indices reflect deep regional food insecurity in indigenous regions such as Guna Yala, Ngäbe-Buglé, and Emberá, as well as in provinces such as Bocas del Toro, Darién, Panamá Oeste, and Veraguas, highlighting the urgent need for decentralized self-cultivation solutions. There is also a wide technical knowledge gap, since hydroponic management tends to be restricted to specialized university or agricultural settings, excluding young people, marginalized communities, and people in the process of social reintegration.

According to reports from the horticultural sector of Panama's Ministry of Commerce and Industry (MICI), national demand for vegetables represents a substantial opportunity for local substitution through hydroponic cultivation. Onions have a consumption of 36,250 tons and offer a wide margin for introducing high-yield hydroponic scallions. Tomatoes register a demand of 19,697 tons, ideal for adapted NFT systems and inert substrate. Lettuce, with 5,356 tons consumed, is the flagship crop for rapid-rotation hydroponic systems. Bell peppers account for 2,432 tons, and leafy vegetables such as chard, spinach, arugula, cilantro, basil, and kale also respond effectively to this technology.

3. OFFICIAL PRODUCT CATALOG

HYDRONEXIS manufactures fully autonomous systems, independent of the commercial power grid, built with a PVC structure, a closed recirculating circuit, and a complete solar kit that includes a panel, battery, controller, and inverter. The HYDRONEXIS Mini model has 20 growing spaces, a materials cost of $45.78, and a sale price of $59.99, generating a gross margin of $14.21, equivalent to 23.69 percent. The HYDRONEXIS Starter model offers 40 growing spaces, with a materials cost of $67.28 and a sale price of $84.99, reaching a gross margin of $17.71, equivalent to 20.84 percent, and includes the option of solar panel integration. For larger-scale projects, the HYDRONEXIS Pro Master model is sold, with custom modular dimensions, maintaining an estimated margin of 25 percent. The main manufacturing components are 3-inch PVC pipes, elbows, recyclable cups, Teflon tape, tank fittings, and a water pump.

The seedling catalog includes traditional varieties of lettuce, spinach, chard, arugula, cilantro, and scallion at $0.40 per unit, as well as specialty varieties of kale and basil at $0.50 per unit. Seed packets have an approximate price of $2.99, based on local suppliers such as Do it Center and Novey, and the available varieties are romaine lettuce, butterhead lettuce, tomato, spinach, scallion, and Red Bell peppers in red, yellow, and green versions. Additionally, HYDRONEXIS offers the "The Chef's Selection" themed kits, which include the Mixology Kit, made up of mint, Thai basil, and edible flowers, and the Medicinal Kit, made up of peppermint, chamomile, and lemon balm.

4. DIGITAL ECOSYSTEM: MOBILE APPLICATION

The mobile platform acts as a social and commercial bridge connecting urban hydroponic producers with local buyers and lower-income people. It integrates a visual simulator and a nutrition assistant for real-time monitoring of pH levels, electrical conductivity, and nutrient solution, in addition to Machine Learning-based optimization algorithms that process local climate data to predict and suggest adjustments to water flow and nutrient dosing. The app offers three subscription tiers: the free Starter Package, with basic guides and community access; the Mid Package, which adds advanced sensor alerts, personalized nutrient recipes, and marketplace access; and the Premium Package, which enables direct network sales, AI-assisted plant health diagnostics, and exclusive discounts on supplies.

5. MONETIZATION MODEL

HYDRONEXIS's revenue structure is diversified across five main lines: direct sales of hardware and solar kits; monthly subscription fees for the mobile app; commissions earned on transactions completed on the Marketplace; recurring sales of substrates, nutrients, and seeds through the online store; and the implementation of social micro-franchises in partnership with public and private institutions to deploy community workshops and nodes.

6. STRATEGIC SWOT ANALYSIS

Among the project's main strengths are 100 percent solar autonomy, near-zero operating cost for the end user, an integrated hardware, software, and education approach, and uninterrupted operation during power failures. Weaknesses are concentrated in the initial cost of solar components, the complexity of technical assembly, and the need for active adoption of the app. Opportunities are driven by the rise of AgTech and the consumption of organic products, inflation in imported food, government incentives for clean energy, and educational corporate social responsibility bids. Threats include the presence of low-cost, non-solar imported kits, extreme climate instability during rainy seasons, and price volatility in supplies such as PVC and electronics.

7. SOCIAL AND EDUCATIONAL PROGRAMS

HYDRONEXIS's social pillar encompasses basic and secondary education programs with hands-on workshops on hydroponic assembly and maintenance. In the prison setting, technical seminars are developed to train incarcerated individuals in system construction and agricultural production, as a tool for workforce reintegration and internal food sovereignty. Community nodes and micro-franchises are also promoted in vulnerable areas, such as Veracruz, to generate local employment. In alignment with the curriculum of Panama's Ministry of Education (MEDUCA) for 12th grade, the project is integrated into three subjects: Physics and Electricity during the first trimester, studying photovoltaic panels, DC circuits, and energy efficiency; Chemistry and Biology during the second trimester, analyzing nutrient solutions, pH control, and inert media; and Business Management and Geography during the third trimester, developing business models and marketing of school harvests. This approach ensures food for school cafeterias and generates an interconnected climate data laboratory.

8. TECHNICAL-SCIENTIFIC FOUNDATION

The system's technical design is backed by specialized agronomic research. Based on studies by De la Rosa and Herrera, the mandatory use of chemically neutral inert substrates, such as perlite or scoria, is implemented, which prevents the transmission of soil pathogens and ensures proper nutrient absorption. Drawing on research by Courville, a pyramidal NFT pipe configuration is adopted to maximize the use of vertical space, allowing for high horticultural production in just 12 square meters. Finally, strict macronutrient control is applied, with nitrogen at 300 parts per million, phosphorus at 85 parts per million, and potassium at 265 parts per million, to accelerate the plant growth rate and prevent nutritional anomalies.

9. TECHNICAL FUNDAMENTALS OF HYDROPONICS

Hydroponics is an intensive agricultural production method that does away entirely with soil as a support and nutrition medium; instead, water directly transports a concentrated solution of essential minerals to plant roots. Unlike traditional soil cultivation, where roots must extend considerably to seek nutrients and moisture, the hydroponic environment delivers nutrition immediately and in a directly assimilable form, drastically reducing the plant's energy expenditure on root development and redirecting that metabolic energy toward vegetative and foliar growth that is 30 to 50 percent faster. Among its advantages are efficient water savings, since closed recirculation circuits reduce water consumption by 80 to 90 percent compared to traditional agriculture; space optimization through high-density vertical configurations; superior phytosanitary control, reducing soil pests by more than 90 percent; and continuous production independent of the native fertility of the soil.

10. HYDROPONIC SYSTEMS: TYPES AND OPERATION

The NFT system, or Nutrient Film Technique, operates through a continuous film of nutrient solution 1 to 2 millimeters deep that circulates through PVC pipes or channels arranged on a slight slope. It is the recommended technique for leafy vegetables such as lettuce, chard, arugula, cilantro, spinach, basil, and scallion, and it offers high root oxygenation, continuous water recirculation, and ease of harvest, although it has the vulnerability that if the pump stops due to power outages, the exposed roots dry out quickly.

The DWC system, or Deep Water Culture (floating root), supports plants on floating material boards, such as expanded polystyrene, placed over a reservoir of nutrient solution constantly oxygenated with air pumps. It is recommended for lettuce, spinach, low-growing leafy vegetables, and aromatic herbs, and it provides high thermal stability of the water and a wide safety margin during power failures, although there is a risk of pathogen proliferation if the water temperature exceeds 24 degrees Celsius or if oxygenation fails.

The Drip Irrigation over Inert Substrate system injects nutrient solution through emitters connected to micro-tubes directed to the base of each plant, over pots or substrate bags. It is the best alternative for tomato, pepper, cucumber, strawberries, and tall plants or heavy-fruiting crops, as it provides solid physical support for heavy structures and allows individual nutrient dosing, although it requires periodic flushing to prevent salt buildup in the substrate.

Aeroponics keeps roots suspended in the air inside a sealed dark chamber, periodically misting them with a fine nutrient fog. It is optimal for tubers such as aeroponic potatoes, medicinal plants, and high-density vegetables, achieving maximum root oxygenation and accelerated growth with minimal water consumption, but it has high technical sensitivity, as the misting nozzles can easily become clogged by salt crystallization.

The Ebb and Flow system uses a tray filled with substrate that is temporarily flooded and then fully drained back to the reservoir tank through a siphon. It is ideal for short-root plants, mass germination, and various aromatic plants, and it stands out for providing excellent gas exchange at the roots with each drainage cycle, requiring the use of precise timers and frequent valve monitoring.

11. INERT SUBSTRATES: TYPES AND PROPERTIES

An inert substrate is a solid, non-living material that replaces soil, functioning as physical anchorage for the plant structure and retaining balanced proportions of air and nutrient solution without altering the chemical properties of the water, since it contributes no nutrients and does not modify pH. Volcanic perlite is a mineral expanded through heat treatment, with extremely low density and high porosity, whose main function is to optimize aeration of the medium to prevent root zone compaction; it is used pure or mixed at 30 to 50 percent with coconut coir. Coconut coir is an organic byproduct of coconut husk processing that has extraordinary moisture retention combined with an air porosity of close to 30 percent; it contains natural lignin that slows its degradation, and it must be washed and sanitized before use to remove excess native sodium or potassium. Rock wool is an inorganic material made by melting basaltic rock at high temperatures and spinning it into fibers; it is sold in cubes or blocks that are fully sterile, with high capillarity and uniform water retention, making it the standard medium for germination and seedling initiation. Scoria and volcanic rock are extrusive igneous rocks with a vesicular, porous structure, low cost, and high durability; being heavy materials, they offer superior mechanical anchorage for thick-stemmed species or heavy fruits like tomatoes and peppers. Expanded clay, or lightweight expanded clay aggregate, consists of clay spheres fired in a rotary kiln that expand to create a porous interior and a hard outer surface; it allows for near-instant drainage and free air circulation, and it is highly reusable after washing and disinfecting with diluted hydrogen peroxide or chlorine.

12. MINERAL NUTRITION AND NUTRIENT SOLUTIONS

Plants grown hydroponically require 16 essential chemical elements dissolved in the nutrient solution to complete their biological cycle. Nitrogen promotes vegetative growth, foliage development, and chlorophyll synthesis, and its deficiency manifests as chlorosis or yellowing in older leaves. Phosphorus is essential for cell division, photosynthesis, root development, and flowering, and its lack shows up as purplish or reddish tones on the underside of leaves. Potassium regulates stomatal opening, cell turgor, and fruit ripening, and its absence causes necrosis or scorching at leaf edges. Calcium forms the structure of the cell wall, and its deficiency causes blossom-end rot in fruit and deformation of young shoots. Magnesium is the central atom of chlorophyll, and its scarcity causes interveinal chlorosis in mature leaves. Sulfur is involved in the synthesis of structural amino acids and proteins. Micronutrients such as iron, manganese, zinc, copper, boron, and molybdenum are required in parts per million, with iron being the most critical for preventing chlorosis in young shoots when applied in the form of stable chelates.

To prevent the precipitation of insoluble salts in concentrate tanks, stock solutions must be prepared by separating the compounds into two distinct reservoirs before diluting them in the main tank. Solution A brings together the calcium and nitrogen concentrate, combining calcium nitrate and iron chelate. Solution B concentrates phosphorus, potassium, magnesium, and micronutrients, combining potassium nitrate, monopotassium phosphate, magnesium sulfate, and micronutrient sulfates. The reason for this separation is that if concentrated calcium comes into direct contact with concentrated sulfates or phosphates, it reacts to form insoluble calcium sulfate, or gypsum, which cancels out the plant's ability to absorb it.

13. CRITICAL CONTROL VARIABLES: PH AND ELECTRICAL CONDUCTIVITY

pH measures the concentration of hydrogen ions in the solution and indicates its degree of acidity or alkalinity; the optimal hydroponic range sits between 5.5 and 6.5. If pH rises above 6.5, the availability of iron, phosphorus, manganese, and zinc becomes blocked, causing severe mineral deficiencies. If pH falls below 5.5, manganese or aluminum toxicity can occur, damaging root tips and blocking calcium and magnesium absorption. To correct these deviations, diluted phosphoric or nitric acid is used to lower pH, or potassium hydroxide to raise it.

Electrical conductivity measures water's ability to conduct electrical current, which is directly proportional to the concentration of dissolved mineral salts in the reservoir. Recommended ranges run from 0.8 to 1.2 milliSiemens per centimeter for the germination stage, from 1.2 to 1.8 for leafy vegetables such as lettuce and cilantro, and from 2.0 to 3.0 for fruiting vegetables such as tomato and pepper. Electrical conductivity below 1.0 induces malnutrition and stunted growth, while a value above 2.5 to 3.0 causes osmotic stress or reverse dehydration, burning leaf edges and wilting the plant.

14. OPERATIONAL GUIDE FOR PLANTING, TRANSPLANTING, AND MAINTENANCE

The germination stage begins by moistening the germination substrate with water adjusted to a pH of 5.8, placing one or two seeds per cell at a depth equal to twice the seed's size. The tray is then kept in complete darkness at a temperature of 20 to 24 degrees Celsius for 48 to 72 hours until the radicle emerges, at which point it is moved to a lit environment to prevent stem etiolation. Transplanting into the main system takes place once the seedling develops its second pair of true leaves and shows visible roots 3 to 5 centimeters long; the seedling is placed inside the growing net cup, secured with lightweight expanded clay or inert substrate, making sure the system's water flow or film touches the base of the net cup to ensure continuous hydration.

The preventive maintenance routine requires daily checks to verify the reservoir's water level, measure and adjust pH and electrical conductivity values by adding clean water or Solution A and B as needed, and check that the pumps are working properly. On a weekly basis, channels should be inspected to scrape off algae and to check that roots remain white and healthy. Every 15 to 20 days, the old nutrient solution must be completely drained to eliminate residual ionic imbalances and refilled with fresh water and nutrients from scratch. Finally, between each harvest cycle, the entire system must be mechanically cleaned and disinfected by circulating a solution of water with hydrogen peroxide or chlorine dioxide for several hours to sterilize the conduits.

15. DIAGNOSIS AND TROUBLESHOOTING OF COMMON PROBLEMS

The presence of yellowing lower leaves or generalized chlorosis points to a nitrogen deficiency or an elevated pH above 6.8 that blocks its absorption; the corrective action is to measure and adjust pH to 5.8, and if the level is already correct, to raise electrical conductivity by adding more Solution A and B. When young leaves or apical shoots appear wrinkled or show necrosis at the edges, the cause is usually a calcium deficiency caused by low transpiration or an unadjusted pH; the solution requires checking calcium concentration in the water, ensuring a pH of 5.8, and improving ventilation in the growing space to reactivate plant transpiration. If roots show a brown color, slimy texture, and an unpleasant smell, this indicates root rot caused by the Pythium fungus, due to water temperatures above 25 degrees Celsius or lack of oxygenation; the corrective action involves applying diluted hydrogen peroxide to the tank, actively oxygenating the reservoir, cooling the water, or fully disinfecting the system. The development of a layer of green algae on the substrate or inside the pipes is caused by direct sunlight reaching the nutrient solution, and it is solved by covering all exposed water reservoirs, hoses, and substrates with dark, light-blocking covers or plastic. Finally, the symptom of burnt leaf tips on mature plants indicates over-fertilization or electrical conductivity above 2.5 milliSiemens per centimeter; the immediate solution is to dilute the nutrient solution by adding clean, mineral-free water to restore electrical conductivity to the optimal range.
What to Grow?

In HYDRONEXIS hydroponic systems, crops such as lettuce, spinach, cilantro, basil, scallions, parsley, and other leafy vegetables can be grown. Crop selection depends on the system’s capacity and the space available for each plant to develop. 

How to Grow?

Planting begins by germinating seeds in a moist growing medium. One or two seeds are placed in each cell. After germination, the seedlings are exposed to light. They can be transplanted into the HYDRONEXIS system once they develop their second pair of true leaves and visible roots approximately 3–5 cm long. 

Nutrients

Hydroponic plants require nutrients dissolved in water, mainly nitrogen, phosphorus, potassium, calcium, magnesium, and sulfur, along with micronutrients such as iron, manganese, zinc, copper, boron, and molybdenum. Proper nutrition requires monitoring the pH and electrical conductivity (EC) of the nutrient solution. 

Problems

Common hydroponic problems include yellow leaves caused by nutrient deficiencies or incorrect pH, brown and slimy roots associated with root rot, algae growth caused by light reaching the nutrient solution, and burned leaf tips caused by excessive salt concentration. 

Pests

Hydroponic crops can develop pests that mainly affect leaves, stems, and young shoots. Plants should be inspected frequently, affected plant material should be removed, and the growing environment should be kept clean to reduce the risk of pest infestations.

Maintenance

HYDRONEXIS systems require regular monitoring of the water level, pH, EC, and pump operation. Roots and pipes should also be inspected, the nutrient solution should be periodically replaced, and the system should be cleaned and disinfected between growing cycles. 

"""


def create_gemini_client():
    """
    Crear el cliente de Gemini con la clave guardada en .env.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError(
            "No se encontró GEMINI_API_KEY en el archivo .env."
        )

    return genai.Client(
        api_key=GEMINI_API_KEY
    )


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": (
            "El servidor del chatbot de HYDRONEXIS "
            "está funcionando."
        )
    }), 200


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(
            silent=True
        ) or {}

        prompt = str(
            data.get("prompt", "")
        ).strip()

        if not prompt:
            return jsonify({
                "error": "No se proporcionó ningún mensaje."
            }), 400

        client = create_gemini_client()

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=(
                    HYDRONEXIS_SYSTEM_INSTRUCTION
                ),
                temperature=0.3,
                max_output_tokens=800
            )
        )

        response_text = str(
            getattr(response, "text", "") or ""
        ).strip()

        if not response_text:
            return jsonify({
                "error": (
                    "Gemini devolvió una respuesta vacía."
                )
            }), 502

        return jsonify({
            "response": response_text
        }), 200

    except RuntimeError as error:
        print(
            "Error de configuración:",
            error
        )

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:
        print(
            "Error de Gemini:",
            repr(error)
        )

        error_text = str(error)

        authentication_errors = (
            "invalid authentication credentials",
            "unauthenticated",
            "access token"
        )

        if any(
            text in error_text.lower()
            for text in authentication_errors
        ):
            return jsonify({
                "error": (
                    "Google rechazó la API key. "
                    "Revisa la clave guardada en el archivo .env."
                )
            }), 401

        if (
            "not found" in error_text.lower()
            and "model" in error_text.lower()
        ):
            return jsonify({
                "error": (
                    f"El modelo {GEMINI_MODEL} no está disponible "
                    "para esta cuenta."
                )
            }), 400

        return jsonify({
            "error": (
                error_text
                or "Ocurrió un error al consultar Gemini."
            )
        }), 500


if __name__ == "__main__":
    print(
        "API key cargada:",
        bool(GEMINI_API_KEY)
    )

    print(
        "Modelo:",
        GEMINI_MODEL
    )

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )