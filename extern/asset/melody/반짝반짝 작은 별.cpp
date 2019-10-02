doUserTask
{
float one = 0.0;
float two = 0.0;
float half = 0.0;
float one_half = 0.0;
float three = 0.0;
float four = 0.0;
float number6 = 0.0;

while(true)
{
	one = 350;
	two = one*2;
	half = one/2;
	number6 = one/4;
	one_half = half*3;
	three = one*3;
	four = one*4;
	speaker0.setTune(F_DO_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_DO_6, 0);
	sleep(number6);
	speaker0.setTune(F_DO_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_DO_6, 0);
	sleep(number6);
	speaker0.setTune(F_SOL_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_SOL_6, 0);
	sleep(number6);
	speaker0.setTune(F_SOL_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_SOL_6, 0);
	sleep(number6);
	speaker0.setTune(F_RA_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RA_6, 0);
	sleep(number6);
	speaker0.setTune(F_RA_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RA_6, 0);
	sleep(number6);
	speaker0.setTune(F_SOL_6, __melodyVolume);
	sleep(two);
	speaker0.setTune(F_SOL_6, 0);
	sleep(number6);
	speaker0.setTune(F_PA_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_PA_6, 0);
	sleep(number6);
	speaker0.setTune(F_PA_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_PA_6, 0);
	sleep(number6);
	speaker0.setTune(F_MI_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_MI_6, 0);
	sleep(number6);
	speaker0.setTune(F_MI_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_MI_6, 0);
	sleep(number6);
	speaker0.setTune(F_RE_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RE_6, 0);
	sleep(number6);
	speaker0.setTune(F_RE_6, __melodyVolume);
	sleep(one);
	speaker0.setTune(F_RE_6, 0);
	sleep(number6);
	speaker0.setTune(F_DO_6, __melodyVolume);
	sleep(two);
	speaker0.setTune(F_DO_6, 0);
	sleep(500);

	sleep(1);
}
}