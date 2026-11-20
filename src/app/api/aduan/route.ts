
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_TUJUAN = "pp.aksalera2026@gmail.com";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json(
        { message: "Konfigurasi email server belum lengkap." },
        { status: 500 }
      );
    }

    const data = await request.json();

    const {
      nama,
      npm,
      programStudi,
      email,
      whatsapp,
      kategori,
      subjek,
      pesan,
    } = data;

    const fields = [
      nama,
      npm,
      programStudi,
      email,
      whatsapp,
      kategori,
      subjek,
      pesan,
    ];

    if (
      fields.some(
        (field) => typeof field !== "string" || !field.trim()
      )
    ) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const nomorWhatsApp = whatsapp.replace(/\D/g, "");

    if (nomorWhatsApp.length < 10 || nomorWhatsApp.length > 15) {
      return NextResponse.json(
        { message: "Nomor WhatsApp tidak valid." },
        { status: 400 }
      );
    }

    if (npm.trim().length < 5 || pesan.trim().length < 20) {
      return NextResponse.json(
        { message: "NPM atau isi aduan belum memenuhi ketentuan." },
        { status: 400 }
      );
    }

    if (subjek.trim().length < 3 || pesan.length > 5000) {
      return NextResponse.json(
        { message: "Subjek atau isi aduan tidak valid." },
        { status: 400 }
      );
    }

    const safe = {
      nama: escapeHtml(nama.trim()),
      npm: escapeHtml(npm.trim()),
      programStudi: escapeHtml(programStudi.trim()),
      email: escapeHtml(email.trim()),
      whatsapp: escapeHtml(whatsapp.trim()),
      kategori: escapeHtml(kategori.trim()),
      subjek: escapeHtml(subjek.trim()),
      pesan: escapeHtml(pesan.trim()).replace(/\n/g, "<br />"),
    };

    const { data: result, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [EMAIL_TUJUAN],
      replyTo: email.trim(),
      subject: `[ADUAN AKSALERAVERSE] ${subjek.trim()}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#202820;max-width:680px;margin:auto;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
          <div style="background:#1F4B3B;padding:28px 32px;color:white">
            <h1 style="margin:0;font-size:23px">Aduan Baru AksaleraVerse</h1>
            <p style="margin:8px 0 0;color:#e5e7eb">Terdapat aduan baru dari pengunjung website.</p>
          </div>

          <div style="padding:28px 32px">
            <h2 style="font-size:17px;color:#1F4B3B">Identitas Pelapor</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:9px 0;width:150px;color:#6b7280">Nama</td><td>${safe.nama}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">NPM</td><td>${safe.npm}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">Program Studi</td><td>${safe.programStudi}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">Email</td><td>${safe.email}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">WhatsApp</td><td>${safe.whatsapp}</td></tr>
            </table>

            <hr style="border:0;border-top:1px solid #e5e7eb;margin:22px 0" />

            <h2 style="font-size:17px;color:#1F4B3B">Informasi Aduan</h2>
            <p><strong>Kategori:</strong> ${safe.kategori}</p>
            <p><strong>Subjek:</strong> ${safe.subjek}</p>

            <div style="background:#f9faf7;padding:18px;border-radius:12px;line-height:1.8;font-size:14px">
              ${safe.pesan}
            </div>

            <p style="margin-top:24px;font-size:12px;color:#6b7280">
              Email ini dikirim secara otomatis melalui formulir Aduan AksaleraVerse.
              Mohon jaga kerahasiaan identitas pelapor.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { message: "Aduan belum berhasil dikirim. Silakan coba kembali." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Aduan berhasil dikirim.",
        id: result?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Aduan API error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
