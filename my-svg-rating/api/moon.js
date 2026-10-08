export default function handler(req, res) {
  // Obtenemos el rating de la URL (por defecto 3.5 si no se provee)
  const { rating = "3.5", max = "5", size = "24" } = req.query;
  
  const numRating = parseFloat(rating);
  const maxRating = parseInt(max, 10);
  const iconSize = parseInt(size, 10);

  // Generamos las lunas en formato SVG de manera dinámica
  let moonsSvg = '';
  const totalWidth = maxRating * (iconSize + 6); // Espaciado de 6px entre iconos

  for (let i = 1; i <= maxRating; i++) {
    let fillPercentage = 0; // 0 = vacía, 100 = llena, 50 = media, etc.
    
    if (numRating >= i) {
      fillPercentage = 100;
    } else if (numRating > i - 1 && numRating < i) {
      fillPercentage = (numRating - (i - 1)) * 100;
    }

    const xOffset = (i - 1) * (iconSize + 6);

    // Definimos un identificador único para el gradiente de cada luna parcial
    const gradId = `moon-grad-${i}`;

    moonsSvg += `
      <g transform="translate(${xOffset}, 0)">
        <defs>
          <linearGradient id="${gradId}">
            <stop offset="${fillPercentage}%" stop-color="#a78bfa" />
            <stop offset="${fillPercentage}%" stop-color="#374151" />
          </linearGradient>
        </defs>
        <!-- Círculo base de la luna (Luna llena / vacía según gradiente) -->
        <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2 - 1}" fill="url(#${gradId})" />
        <!-- Opcional: Borde sutil para darle relieve -->
        <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2 - 1}" fill="none" stroke="#7c3aed" stroke-width="1" opacity="0.6"/>
      </g>
    `;
  }

  // Estructura completa del archivo SVG
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${iconSize}" viewBox="0 0 ${totalWidth} ${iconSize}">
      ${moonsSvg}
    </svg>
  `;

  // Cabeceras indispensables para que Markdown y los navegadores reconozcan el SVG
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  
  return res.status(200).send(svgContent.trim());
}