import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Process and optimize image
export const processImage = async (filePath, options = {}) => {
  try {
    const {
      width = 1920,
      height = null,
      quality = 80,
      format = 'webp'
    } = options;

    const processedFileName = path.basename(filePath, path.extname(filePath)) + '.' + format;
    const processedPath = path.join(path.dirname(filePath), processedFileName);

    await sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toFile(processedPath);

    // Delete original file if different format
    if (path.extname(filePath) !== '.' + format) {
      fs.unlinkSync(filePath);
    }

    return processedPath;
  } catch (error) {
    throw new Error('Image processing failed: ' + error.message);
  }
};

// Upload single image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Process image
    const processedPath = await processImage(req.file.path, {
      width: 1920,
      quality: 85,
      format: 'webp'
    });

    // Generate URL
    const relativePath = path.relative(
      path.join(__dirname, '../'),
      processedPath
    ).replace(/\\/g, '/');
    
    const imageUrl = `${req.protocol}://${req.get('host')}/${relativePath}`;

    res.status(200).json({
      success: true,
      data: {
        url: imageUrl,
        filename: path.basename(processedPath),
        size: fs.statSync(processedPath).size,
        mimetype: 'image/webp'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
};

// Upload multiple images
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const processedImages = [];

    // Process each image
    for (const file of req.files) {
      const processedPath = await processImage(file.path, {
        width: 1920,
        quality: 85,
        format: 'webp'
      });

      const relativePath = path.relative(
        path.join(__dirname, '../'),
        processedPath
      ).replace(/\\/g, '/');
      
      const imageUrl = `${req.protocol}://${req.get('host')}/${relativePath}`;

      processedImages.push({
        url: imageUrl,
        filename: path.basename(processedPath),
        size: fs.statSync(processedPath).size,
        mimetype: 'image/webp'
      });
    }

    res.status(200).json({
      success: true,
      data: processedImages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images'
    });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const { category = 'general' } = req.query;

    const uploadsDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, category, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
};

// Get all images in a category
export const getImages = async (req, res) => {
  try {
    const { category = 'general' } = req.query;
    const uploadsDir = path.join(__dirname, '../uploads');
    const categoryPath = path.join(uploadsDir, category);

    // Check if category exists
    if (!fs.existsSync(categoryPath)) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Read all files in category
    const files = fs.readdirSync(categoryPath);
    
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(categoryPath, file);
        const stats = fs.statSync(filePath);
        const relativePath = path.relative(
          path.join(__dirname, '../'),
          filePath
        ).replace(/\\/g, '/');
        
        return {
          url: `${req.protocol}://${req.get('host')}/${relativePath}`,
          filename: file,
          size: stats.size,
          uploadedAt: stats.birthtime
        };
      });

    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get images'
    });
  }
};
