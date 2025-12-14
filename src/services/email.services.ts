import { transporter } from "../config/mailer";

export const sendEmailCita = async (
  emailDestino: string, 
  tipo: 'creada' | 'eliminada', 
  datos: { fecha: Date; nombrePaciente: string }
) => {
  
  const asunto = tipo === 'creada' 
    ? "Confirmación de Cita Médica" 
    : "Cancelación de Cita Médica";

  const color = tipo === 'creada' ? "#28a745" : "#dc3545"; 
  const titulo = tipo === 'creada' ? "¡Cita Agendada!" : "Cita Cancelada";

  
  const fechaLegible = new Date(datos.fecha).toLocaleString('es-AR', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
      <h2 style="color: ${color};">${titulo}</h2>
      <p>Hola <strong>${datos.nombrePaciente}</strong>,</p>
      <p>Te informamos que tu cita ha sido <b>${tipo}</b>.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p style="margin: 0;"><b>Fecha y Hora:</b> ${fechaLegible}</p>
      </div>

      <p>Si no reconoces esta acción, por favor contáctanos.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Centro Médico" <tucorreo@gmail.com>',
      to: emailDestino,
      subject: asunto,
      html: htmlContent,
    });
    console.log(`Email de cita ${tipo} enviado a ${emailDestino}`);
  } catch (error) {
    console.error("Error enviando email:", error);
    
  }
};