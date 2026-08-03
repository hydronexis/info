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
HYDRONEXIS — BASE DE CONOCIMIENTO EN PÁRRAFOS

1. IDENTIDAD DEL PROYECTO

La misión de HYDRONEXIS es democratizar el acceso a alimentos frescos, ecológicos y libres de agroquímicos mediante tecnología hidropónica solar accesible, educación inclusiva y un ecosistema digital interactivo que empodere a hogares, escuelas y comunidades vulnerables a lograr la autosuficiencia alimentaria. Su visión es consolidarse, para el año 2030, como la plataforma líder de agrotecnología urbana e impacto social en Panamá y América Latina, transformando la producción local de hortalizas a través de energía limpia, inteligencia artificial aplicada al autocultivo y redes comunitarias de producción sustentable. Sus objetivos estratégicos se enfocan en tres frentes: la monetización y sostenibilidad financiera mediante la venta de hardware hidropónico autónomo, membresías en la aplicación móvil, kits temáticos de semillas y un Marketplace inclusivo; la inclusión y equidad agro-educativa, rompiendo el mito de que la hidroponía es exclusiva de profesionales o niveles socioeconómicos altos; y la optimización tecnológica mediante algoritmos de cultivo y monitoreo inteligente de variables críticas como el pH, los nutrientes y la temperatura.

2. DIAGNÓSTICO DEL PROBLEMA Y CONTEXTO DE MERCADO

El alto costo de los vegetales frescos en los supermercados limita de forma severa el acceso a dietas saludables para las familias de estratos medio-bajos, convirtiendo la nutrición limpia en un privilegio excluyente. A esto se suma la vulnerabilidad de los sistemas hidropónicos tradicionales, que sufren pérdidas catastróficas ante interrupciones del flujo eléctrico, un problema recurrente en varias regiones del país. Los índices de pobreza multidimensional reflejan una profunda inseguridad alimentaria en comarcas como Guna Yala, Ngäbe Buglé y Emberá, y en provincias como Bocas del Toro, Darién, Panamá Oeste y Veraguas, lo que evidencia la necesidad de soluciones descentralizadas de autocultivo. Persiste además una amplia brecha de conocimiento técnico, ya que el manejo hidropónico suele estar restringido a entornos universitarios o agrícolas especializados, excluyendo a jóvenes, comunidades marginales y personas en proceso de reinserción social.

Según reportes del sector hortofrutícola del Ministerio de Comercio e Industrias (MICI), la demanda nacional de hortalizas representa una oportunidad sustancial de sustitución local mediante cultivo hidropónico. La cebolla tiene un consumo de 36,250 toneladas y ofrece un amplio margen para introducir cebollina hidropónica de alto rendimiento. El tomate registra una demanda de 19,697 toneladas, ideal para sistemas NFT adaptados y sustrato inerte. La lechuga, con 5,356 toneladas consumidas, es el cultivo insignia de rápida rotación en sistemas hidropónicos. El ají pimiento suma 2,432 toneladas, y las hortalizas de hoja como acelga, espinaca, rúcula, cilantro, albahaca y kale también responden eficazmente a esta tecnología.

3. CATÁLOGO OFICIAL DE PRODUCTOS

HYDRONEXIS fabrica sistemas 100% autónomos e independientes de la red eléctrica comercial, construidos con estructura de PVC, circuito cerrado recirculante y un kit solar completo que incluye panel, batería, controlador e inversor. El modelo HYDRONEXIS Mini cuenta con 20 espacios de cultivo, tiene un costo de materiales de 45.78 dólares y un precio de venta de 59.99 dólares, generando un margen bruto de 14.21 dólares, equivalente al 23.69 por ciento. El modelo HYDRONEXIS Starter ofrece 40 espacios de cultivo, con un costo de materiales de 67.28 dólares y un precio de venta de 84.99 dólares, alcanzando un margen bruto de 17.71 dólares, equivalente al 20.84 por ciento, e incluye la opción de integración con paneles solares. Para proyectos de mayor escala se comercializa el modelo HYDRONEXIS Pro Master, de dimensiones modulares personalizadas, manteniendo un margen estimado del 25 por ciento. Los componentes principales de fabricación son tubos de PVC de 3 pulgadas, codos, vasos reciclables, teflón, uniones de tanque y bomba de agua.

El catálogo de plantones incluye variedades tradicionales de lechuga, espinaca, acelga, rúcula, cilantro y cebollina a 0.40 dólares por unidad, así como variedades especiales de kale y albahaca a 0.50 dólares por unidad. Los sobres de semillas tienen un precio aproximado de 2.99 dólares, tomando como referencia proveedores locales como Do it Center y Novey, y las variedades disponibles son lechuga romana, lechuga mantequilla, tomate, espinaca, cebollina y pimiento morrón Red Bell en sus versiones roja, amarilla y verde. Adicionalmente, HYDRONEXIS ofrece los kits temáticos "The Chef's Selection", entre los que destacan el Kit Coctelería, compuesto por mentas, albahaca tailandesa y flores comestibles, y el Kit Medicinal, compuesto por hierbabuena, manzanilla y toronjil.

4. ECOSISTEMA DIGITAL: APLICACIÓN MÓVIL

La plataforma móvil funciona como un puente social y comercial que conecta a productores hidropónicos urbanos con compradores locales y personas de menores recursos. Integra un simulador visual y un asistente nutritivo para el monitoreo en tiempo real de los niveles de pH, electroconductividad y solución de nutrientes, además de algoritmos de optimización basados en Machine Learning que procesan datos climáticos locales para predecir y sugerir ajustes en el caudal de agua y la dosificación nutricional. La aplicación ofrece tres niveles de suscripción: el Paquete Inicial, gratuito, con guías básicas y acceso a la comunidad; el Paquete Medio, que añade alertas avanzadas de sensores, recetas de nutrientes personalizadas y acceso al marketplace; y el Paquete Premium, que habilita ventas directas en la red, diagnósticos de salud vegetal asistidos por inteligencia artificial y descuentos exclusivos en insumos.

5. MODELO DE MONETIZACIÓN

La estructura de ingresos de HYDRONEXIS se diversifica en cinco líneas principales: la venta directa de hardware y kits solares; el cobro de suscripciones mensuales en la aplicación móvil; la percepción de comisiones por transacciones concretadas en el Marketplace; la comercialización recurrente de sustratos, nutrientes y semillas en la tienda en línea; y la implementación de micro-franquicias sociales en alianza con instituciones públicas y privadas para el despliegue de talleres y nodos comunitarios.

6. ANÁLISIS ESTRATÉGICO FODA

Entre las principales fortalezas del proyecto destacan la autonomía 100 por ciento solar, el costo operativo casi nulo para el usuario final, el enfoque integral de hardware, software y educación, y el funcionamiento ininterrumpido ante fallas eléctricas. Las debilidades se concentran en el costo inicial derivado de los componentes solares, la complejidad de ensamblaje técnico y la necesidad de adopción activa de la aplicación. Las oportunidades se impulsan por el auge del AgTech y el consumo de productos orgánicos, la inflación en alimentos importados, los incentivos gubernamentales a la energía limpia y las licitaciones educativas de responsabilidad social empresarial. Las amenazas abarcan la presencia de kits importados de bajo costo no solares, la inestabilidad climática extrema durante temporadas lluviosas y la volatilidad en los precios de insumos como el PVC y la electrónica.

7. PROGRAMAS SOCIALES Y EDUCATIVOS

El pilar social de HYDRONEXIS abarca programas de educación básica y media con talleres prácticos de ensamblaje y mantenimiento hidropónico. En el ámbito penitenciario se desarrollan seminarios técnicos para capacitar a personas privadas de libertad en la construcción de sistemas y producción agrícola, como herramienta de reinserción laboral y soberanía alimentaria interna. También se promueven nodos comunitarios y micro-franquicias en zonas vulnerables, como Veracruz, para la generación de empleo local. En alineación con el plan curricular del Ministerio de Educación (MEDUCA) para 12o grado, el proyecto se integra en tres asignaturas: en Física y Electricidad durante el primer trimestre, estudiando paneles fotovoltaicos, circuitos DC y eficiencia energética; en Química y Biología durante el segundo trimestre, analizando soluciones nutritivas, control de pH y medios inertes; y en Gestión Empresarial y Geografía durante el tercer trimestre, desarrollando modelos de negocio y comercialización de cosechas escolares. Este enfoque garantiza alimentos para comedores escolares y genera un laboratorio de datos climáticos interconectado.

8. FUNDAMENTO TÉCNICO-CIENTÍFICO

El diseño técnico del sistema se respalda en investigaciones agronómicas especializadas. Con base en los estudios de De la Rosa y Herrera, se implementa el uso obligatorio de sustratos inertes químicamente neutros, como la perlita o el tezontle, lo que previene la transmisión de patógenos del suelo y asegura la correcta absorción de nutrientes. Apoyándose en las investigaciones de Courville, se adopta la configuración piramidal de tuberías NFT para maximizar el aprovechamiento del espacio vertical, permitiendo una alta producción hortícola en solo 12 metros cuadrados. Finalmente, se aplica un riguroso control de macronutrientes, con nitrógeno a 300 partes por millón, fósforo a 85 partes por millón y potasio a 265 partes por millón, para acelerar la tasa de crecimiento vegetal y evitar anomalías nutricionales.

9. FUNDAMENTOS TÉCNICOS DE LA HIDROPONÍA

La hidroponía es un método intensivo de producción agrícola que prescinde por completo del suelo como medio de soporte y nutrición; en su lugar, el agua transporta directamente una solución concentrada de minerales esenciales hacia las raíces de las plantas. A diferencia del cultivo tradicional, donde las raíces deben extenderse para buscar nutrientes y humedad, el entorno hidropónico entrega la nutrición de forma inmediata y directamente asimilable, lo que reduce el gasto energético de la planta en desarrollo radicular y redirecciona esa energía hacia un crecimiento vegetativo y foliar hasta un 30 a 50 por ciento más rápido. Entre sus ventajas destacan el ahorro de agua, ya que los circuitos cerrados de recirculación reducen el consumo hídrico entre un 80 y un 90 por ciento frente a la agricultura tradicional; la optimización del espacio mediante configuraciones verticales de alta densidad; un control fitosanitario superior, al reducir en más de un 90 por ciento las plagas del suelo; y una producción continua independiente de la fertilidad nativa de la tierra.

10. SISTEMAS HIDROPÓNICOS: TIPOS Y FUNCIONAMIENTO

El sistema NFT, o Técnica de Película Nutritiva, opera mediante una lámina continua de solución nutritiva de 1 a 2 milímetros de profundidad que circula por tuberías o canales de PVC dispuestos en leve pendiente. Es la técnica recomendada para hortalizas de hoja como lechugas, acelgas, rúcula, cilantro, espinaca, albahaca y cebollina, y ofrece alta oxigenación radicular, recirculación continua de agua y facilidad de cosecha, aunque presenta la vulnerabilidad de que, si la bomba se detiene por cortes eléctricos, las raíces expuestas se secan con rapidez.

El sistema DWC, o Raíz Flotante, sostiene a las plantas sobre planchas de material flotante, como poliestireno expandido, ubicadas sobre un estanque de solución nutritiva oxigenada constantemente con bombas de aire. Se recomienda para lechugas, espinacas, hortalizas de hoja de porte bajo y hierbas aromáticas, y brinda alta estabilidad térmica del agua y un amplio margen de seguridad ante fallas eléctricas, aunque existe el riesgo de proliferación de patógenos si la temperatura del agua supera los 24 grados Celsius o si falla la oxigenación.

El sistema de Riego por Goteo sobre Sustrato Inerte inyecta la solución nutritiva a través de emisores conectados a microtubos dirigidos a la base de cada planta, sobre macetas o bolsas de sustrato. Es la mejor alternativa para tomate, pimiento, pepino, fresas y plantas de porte alto o frutos pesados, ya que proporciona un soporte físico sólido y permite dosificar los nutrientes individualmente, aunque requiere lavados periódicos para evitar la acumulación de sales en el sustrato.

La Aeroponía mantiene las raíces suspendidas en el aire dentro de una cámara oscura hermética, rociándolas periódicamente con una niebla fina de nutrientes. Es óptima para tubérculos como la papa aeropónica, plantas medicinales y hortalizas de alta densidad, logra la máxima oxigenación del sistema radicular y un crecimiento acelerado con consumo mínimo de agua, pero posee una alta sensibilidad técnica, ya que los nebulizadores pueden obstruirse fácilmente por cristalización de sales.

El sistema de Flujo y Reflujo utiliza una bandeja cargada con sustrato que se inunda temporalmente y se drena por completo hacia el tanque reservorio mediante un sifón. Resulta ideal para plantas de raíz corta, germinación masiva y plantas aromáticas variadas, y destaca por proporcionar un excelente intercambio gaseoso en las raíces con cada ciclo de drenaje, requiriendo el uso de temporizadores precisos y el monitoreo frecuente de las válvulas.

11. SUSTRATOS INERTES: TIPOS Y PROPIEDADES

Un sustrato inerte es un material sólido no vivo que reemplaza a la tierra, funcionando como anclaje físico a la estructura vegetal y reteniendo proporciones equilibradas de aire y solución nutritiva, sin alterar las propiedades químicas del agua, ya que no aporta nutrientes ni modifica el pH. La perlita volcánica es un mineral expandido por tratamiento térmico, de densidad extremadamente baja y elevada porosidad, cuya función principal es optimizar la aireación del medio para evitar la compactación radicular; se usa pura o mezclada entre un 30 y un 50 por ciento con fibra de coco. La fibra de coco es un subproducto orgánico de la cáscara de coco, con extraordinaria retención de humedad y una porosidad de aire cercana al 30 por ciento; contiene lignina natural que ralentiza su degradación y debe lavarse e higienizarse antes de su uso para eliminar excesos de sodio o potasio nativo. La lana de roca es un material inorgánico fabricado al fundir roca basáltica a altas temperaturas e hilarla en fibras; se comercializa en cubos o bloques totalmente estériles, con alta capilaridad y retención uniforme de agua, siendo el medio estándar para la germinación e iniciación de plántulas. El tezontle y la roca volcánica son rocas ígneas extrusivas, de estructura vesicular y porosa, de bajo costo y alta durabilidad; al ser materiales pesados, ofrecen un anclaje mecánico superior para sostener especies de tallo grueso o frutos pesados como tomates y chiles. La arcilla expandida, o arlita, consiste en esferas de arcilla cocidas en horno rotatorio que se expanden generando un interior poroso y una superficie externa dura; permite un drenaje casi instantáneo y circulación libre de aire, y es altamente reutilizable tras lavarse y desinfectarse con agua oxigenada o cloro diluido.

12. NUTRICIÓN MINERAL Y SOLUCIONES NUTRITIVAS

Las plantas en hidroponía requieren 16 elementos químicos esenciales disueltos en la solución nutritiva para completar su ciclo biológico. El nitrógeno promueve el crecimiento vegetativo, el desarrollo foliar y la síntesis de clorofila, y su deficiencia se manifiesta como clorosis o amarilleamiento en las hojas viejas. El fósforo es indispensable para la división celular, la fotosíntesis, el desarrollo radicular y la floración, y su falta se muestra a través de tonos purpúreos o rojizos en el envés foliar. El potasio regula la apertura de estomas, la turgencia celular y la maduración de frutos, y su ausencia provoca necrosis o quemado en los bordes foliares. El calcio forma la estructura de la pared celular, y su deficiencia genera necrosis apical en frutos y deformación en brotes jóvenes. El magnesio es el átomo central de la clorofila, y su escasez provoca clorosis interlineal en hojas maduras. El azufre interviene en la síntesis de aminoácidos estructurales y proteínas. Los micronutrientes, como hierro, manganeso, zinc, cobre, boro y molibdeno, se requieren en partes por millón, siendo el hierro el más crítico para prevenir la clorosis apical en brotes jóvenes cuando se aplica en forma de quelatos estables.

Para evitar la precipitación de sales insolubles en los tanques de concentrados, las formulaciones madre deben prepararse separando los compuestos en dos depósitos distintos antes de diluirlos en el estanque principal. La Solución A reúne el concentrado de calcio y nitrógeno, agrupando nitrato de calcio y quelato de hierro. La Solución B concentra el fósforo, el potasio, el magnesio y los micronutrientes, combinando nitrato de potasio, monofosfato de potasio, sulfato de magnesio y sulfatos de micronutrientes. La razón de esta separación es que, si el calcio concentrado entra en contacto directo con sulfatos o fosfatos concentrados, reacciona formando sulfato de calcio o yeso insolubilizado, lo que anula la capacidad de absorción de la planta.

13. VARIABLES CRÍTICAS DE CONTROL: PH Y ELECTROCONDUCTIVIDAD

El pH mide la concentración de iones de hidrógeno en la solución e indica su grado de acidez o alcalinidad; el rango óptimo hidropónico se sitúa entre 5.5 y 6.5. Si el pH sube por encima de 6.5, la disponibilidad de hierro, fósforo, manganeso y zinc se bloquea, provocando deficiencias minerales severas. Si el pH cae por debajo de 5.5, se puede generar toxicidad por manganeso o aluminio, dañando las puntas radiculares y bloqueando la absorción de calcio y magnesio. Para corregir estas desviaciones se utiliza ácido fosfórico o nítrico diluido para reducir el pH, o hidróxido de potasio para elevarlo.

La electroconductividad mide la capacidad del agua para conducir corriente eléctrica, directamente proporcional a la concentración de sales minerales disueltas en el reservorio. Los rangos recomendados oscilan entre 0.8 y 1.2 miliSiemens por centímetro para la etapa de germinación, entre 1.2 y 1.8 para hortalizas de hoja como lechuga y cilantro, y entre 2.0 y 3.0 para hortalizas de fruto como tomate y pimiento. Una electroconductividad inferior a 1.0 induce desnutrición y estancamiento del crecimiento, mientras que un valor superior a 2.5 o 3.0 provoca estrés osmótico o deshidratación inversa, quemando los bordes de las hojas y marchitando la planta.

14. GUÍA OPERATIVA DE SIEMBRA, TRASPLANTE Y MANTENIMIENTO

La fase de germinación comienza humedeciendo el sustrato con agua a un pH ajustado de 5.8, colocando una o dos semillas por alvéolo a una profundidad equivalente al doble de su tamaño. Posteriormente, la bandeja se resguarda en oscuridad absoluta a una temperatura de 20 a 24 grados Celsius durante 48 a 72 horas, hasta presenciar la emergencia de la radícula, momento en el cual se traslada a un entorno iluminado para prevenir la etiolación del tallo. El trasplante al sistema principal se efectúa cuando la plántula desarrolla su segundo par de hojas verdaderas y muestra raíces visibles de 3 a 5 centímetros de longitud; se coloca dentro de la canastilla de cultivo, fijándola con arlita o sustrato inerte, y se asegura que el flujo o la película de agua del sistema toque la base de la canastilla para garantizar su hidratación continua.

La rutina de mantenimiento preventivo exige revisiones diarias para verificar el nivel de agua del reservorio, medir y ajustar los valores de pH y electroconductividad agregando agua limpia o solución A y B según corresponda, y comprobar el funcionamiento de las bombas. De forma semanal, se deben inspeccionar los canales para descascarar algas y evaluar que las raíces se mantengan blancas y sanas. Cada 15 a 20 días es necesario vaciar completamente la solución nutritiva vieja para eliminar desbalances iónicos residuales y rellenar con agua fresca y nutrientes desde cero. Finalmente, entre cada ciclo de cosecha, todo el sistema debe limpiarse mecánicamente y desinfectarse circulando una solución de agua con peróxido de hidrógeno o dióxido de cloro durante varias horas para esterilizar los conductos.

15. DIAGNÓSTICO Y SOLUCIÓN DE PROBLEMAS FRECUENTES

La presencia de hojas inferiores amarillentas o clorosis generalizada señala una deficiencia de nitrógeno o un pH elevado por encima de 6.8 que bloquea su absorción; la acción correctiva consiste en medir y ajustar el pH a 5.8, y si el nivel es correcto, elevar la electroconductividad agregando más solución A y B. Cuando las hojas jóvenes o los brotes apicales lucen arrugados o con necrosis en los bordes, la causa suele ser una deficiencia de calcio provocada por baja transpiración o pH desajustado; la solución requiere verificar la concentración de calcio en el agua, asegurar un pH de 5.8 y mejorar la ventilación del espacio de cultivo para reactivar la transpiración vegetal. Si las raíces presentan coloración marrón, consistencia viscosa y olor desagradable, se trata de una pudrición radicular causada por el hongo Pythium, debido a temperaturas del agua superiores a 25 grados Celsius o falta de oxigenación; la acción correctiva involucra aplicar agua oxigenada diluida en el tanque, oxigenar activamente el reservorio, enfriar el agua o desinfectar el sistema por completo. El desarrollo de una capa de algas verdes sobre el sustrato o dentro de las tuberías se debe a la entrada directa de luz solar sobre la solución nutritiva, y se soluciona cubriendo todos los depósitos de agua, mangueras y sustratos expuestos con tapas o plásticos oscuros anti-luz. Por último, el síntoma de puntas de hojas quemadas en plantas maduras evidencia un exceso de fertilización o una electroconductividad superior a 2.5 miliSiemens por centímetro; la solución inmediata consiste en diluir la solución nutritiva agregando agua limpia sin minerales para restablecer la electroconductividad al rango óptimo.
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