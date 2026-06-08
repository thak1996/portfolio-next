import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  
  // Basic security check to prevent path traversal
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
