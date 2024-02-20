//package com.zalolite.accountservice;
//
//import com.google.zxing.BarcodeFormat;
//import com.google.zxing.MultiFormatWriter;
//import com.google.zxing.common.BitMatrix;
//
//import javax.imageio.ImageIO;
//import java.awt.image.BufferedImage;
//import java.io.File;
//
//public class TestQR {
//
//    public static void main(String[] args) {
//        String data = "Hello, World!";
//        String filePath = "qrcode.png";
//
//        try {
//            BitMatrix matrix = new MultiFormatWriter().encode(data, BarcodeFormat.QR_CODE, 200, 200);
//            BufferedImage image = toBufferedImage(matrix);
//
//            ImageIO.write(image, "png", new File(filePath));
//            System.out.println("oke: " + filePath);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private static BufferedImage toBufferedImage(BitMatrix matrix) {
//        int width = matrix.getWidth();
//        int height = matrix.getHeight();
//        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
//
//        for (int x = 0; x < width; x++) {
//            for (int y = 0; y < height; y++) {
//                image.setRGB(x, y, matrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
//            }
//        }
//        return image;
//    }
//}
