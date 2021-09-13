# SeamlessClone을 활용한 이미지 합성 (seamlessclone.py)

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
img_wand = cv2.imread(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_wand_001_big.png",-1)

img_full = cv2.addWeighted(img_face, 0.5, img_head, 0.5, 0)
# cv2.imwrite(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_item_001_big.png",img_full)
cv2.imshow(r"001",img_full)

cv2.waitKey(0)
cv2.destroyAllWindows()




# #--② 마스크 생성, 합성할 이미지 전체 영역을 255로 셋팅
# mask = np.full_like(img_face, 255)
 
# #--③ 합성 대상 좌표 계산(img2의 중앙)
# height, width = img_head.shape[:2]
# center = (width//2, height//2)
 
# #--④ seamlessClone 으로 합성 
# normal = cv2.seamlessClone(img_face, img_head, mask, center, cv2.NORMAL_CLONE)
# mixed = cv2.seamlessClone(img_face, img_head, mask, center, cv2.MIXED_CLONE)
# cv2.imwrite(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_item_001_big.png",normal)

#--⑤ 결과 출력
# cv2.imshow('normal', normal)
# cv2.waitKey(0)
# cv2.destroyAllWindows()