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

# 영상의 15%를 알파 블렌딩의 범위로 지정

# 합성할 영상 읽기
img_bg = cv2.imread(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\bg.png",1)
# img_face = cv2.imread(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_face_001_big.png",-1)
img_head = cv2.imread(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_head_001_big.png",-1)
# img_wand = cv2.imread(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_wand_001_big.png",-1)
img_face = read_transparent_png(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_face_001_big.png")

cv2.imshow(r"001",img_bg)
cv2.imshow(r"001-1",img_head)
cv2.imshow(r"002",img_face)

# img_full = cv2.addWeighted(img_bg,0,img_face,1,0)
# cv2.imshow(r"003",img_full)

# temp = cv2.add(img_full,img_head)
# cv2.imshow(r"004",temp)
# img_full2 = cv2.addWeighted(img_full,0.5,img_head,0.5,0)
# cv2.imshow(r"003",img_full2)

# addWeighted() 함수로 알파 블렌딩 적용
# img_full = cv2.add(img_bg, img_face)
# img_full = cv2.addWeighted(img_bg, 0.5, img_face, 0.5, 0)
# cv2.imwrite(r"D:\Dropbox\00.webTest\k2amj2ik.github.io\img_generator\img\99_item_001_big.png",img_full)
# cv2.imshow(r"001",img_full)

cv2.waitKey(0)
cv2.destroyAllWindows()

# img_comp = np.zeros_like(img_face)

# # 연산에 필요한 좌표 계산
# height, width = img_face.shape[:2]
# middle = width//2                             # 영상의 중앙 좌표
# alpha_width = width * alpha_width_rate // 100 # 알파 블렌딩 범위
# start = middle - alpha_width//2               # 알파 블렌딩 시작 지점
# step = 100/alpha_width                        # 알파 값 간격

# # 입력 영상의 절반씩 복사해서 결과 영상에 합성
# img_comp[:, :middle, : ] = img_face[:, :middle, :].copy()
# img_comp[:, middle:, :] = img_head[:, middle:, :].copy()
# cv2.imshow('half', img_comp)

# # 알파 값을 바꾸면서 알파 블렌딩 적용
# for i in range(alpha_width+1 ):
#     alpha = (100 - step * i) / 100  # 증감 간격에 따른 알파 값 (1~0)
#     beta = 1 - alpha                # 베타 값 (0~1)
#     # 알파 블렌딩 적용
#     img_comp[:, start+i] = img_face[:, start+i] * \
#                                 alpha + img_head[:, start+i] * beta
#     print(i, alpha, beta)
    
# cv2.imshow('half skull', img_comp)
# cv2.waitKey()
# cv2.destroyAllWindows()
