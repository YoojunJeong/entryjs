doUserTask
{
float one = 0.0;
float two = 0.0;
float half = 0.0;
float one_half = 0.0;
float three = 0.0;
float four = 0.0;
float number6 = 0.0;
float number7 = 0.0;
float number8 = 0.0;
float number9 = 0.0;
float number10 = 0.0;
float number11 = 0.0;

while(true)
{
	one = 400;
	half = one/2;
	two = one*2;
	three = one*3;
	four = one*4;
	one_half = half*3;
	number10 = one/6;
	number6 = one/4;
	number7 = one/3;
	number8 = half/2;
	number9 = half+number8;
	number11 = two+half;
	speaker0.setTune(F_RE_7, __melodyVolume);
	sleep(one_half);
	sleep(number10);
	speaker0.setTune(F_SI_6, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_DO_7, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_RE_7, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(3135, __melodyVolume);
	sleep(one);
	sleep(number10);
	speaker0.setTune(2959, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_MI_7, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RA_6, 0);
	sleep(half);
	speaker0.setTune(F_DO_7, __melodyVolume);
	sleep(one);
	sleep(number10);
	speaker0.setTune(F_SI_6, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_RA_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RA_6, 0);
	sleep(half);
	speaker0.setTune(F_MI_7, __melodyVolume);
	sleep(one);
	sleep(number10);
	speaker0.setTune(F_RE_7, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_SI_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RA_6, 0);
	sleep(half);
	speaker0.setTune(F_RE_7, __melodyVolume);
	sleep(one);
	sleep(number10);
	speaker0.setTune(F_SI_6, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_DO_7, __melodyVolume);
	sleep(half);
	sleep(number6);
	speaker0.setTune(F_RE_7, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(3135, __melodyVolume);
	sleep(one);
	sleep(number10);
	speaker0.setTune(2959, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_MI_7, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RA_6, 0);
	sleep(half);
	speaker0.setTune(F_DO_7, __melodyVolume);
	sleep(one);
	sleep(number10);
	speaker0.setTune(F_SI_6, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_RA_6, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_MI_7, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_RE_7, __melodyVolume);
	sleep(half);
	sleep(number10);
	speaker0.setTune(F_SOL_6, __melodyVolume);
	sleep(one_half);
	speaker0.setTune(F_RA_6, 0);
	sleep(600);

	sleep(1);
}
}