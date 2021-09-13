import cv2
import numpy as np

# 기본 이미지 배경에 투명영역 흰색으로 채우기(검정색으로 랜더링 되므로..)
def read_transparent_png(filename):
    image_4channel = cv2.imread(filename, cv2.IMREAD_UNCHANGED)
    alpha_channel = image_4channel[:,:,3]
    rgb_channels = image_4channel[:,:,:3]
    
    # White Background Image
    white_background_image = np.ones_like(rgb_channels, dtype=np.uint8) * 255
    
    # Alpha factor
    alpha_factor = alpha_channel[:,:,np.newaxis].astype(np.float32) / 255.0
    alpha_factor = np.concatenate((alpha_factor,alpha_factor,alpha_factor), axis=2)
    
    # Transparent Image Rendered on White Background
    base = rgb_channels.astype(np.float32) * alpha_factor
    white = white_background_image.astype(np.float32) * (1 - alpha_factor)
    final_image = base + white
    return final_image.astype(np.uint8)


#--① 합성 대상 영상 읽기
img_face = read_transparent_png(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_face_001_big.png")
img_head = cv2.imread(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_head_001_big.png",-1)


#--② 알파채널을 이용해서 마스크와 역마스크 생성
_, mask = cv2.threshold(img_head[:,:,3], 1, 255, cv2.THRESH_BINARY)
mask_inv = cv2.bitwise_not(mask)

#--③ 전경 영상 크기로 배경 영상에서 ROI 잘라내기
img_head = cv2.cvtColor(img_head, cv2.COLOR_BGRA2BGR)
h, w = img_head.shape[:2]
roi = img_face[10:10+h, 10:10+w ]

#--④ 마스크 이용해서 오려내기
masked_fg = cv2.bitwise_and(img_head, img_head, mask=mask)
masked_bg = cv2.bitwise_and(roi, roi, mask=mask_inv)

#--⑥ 이미지 합성
added = masked_fg + masked_bg
img_face[10:10+h, 10:10+w] = added

cv2.imshow('mask', mask)
cv2.imshow('mask_inv', mask_inv)
cv2.imshow('masked_fg', masked_fg)
cv2.imshow('masked_bg', masked_bg)
cv2.imshow('added', added)
cv2.imshow('result', img_face)
cv2.waitKey()
cv2.destroyAllWindows()